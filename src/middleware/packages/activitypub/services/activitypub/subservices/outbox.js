const fetch = require('node-fetch');
const { Errors: E } = require('moleculer-web');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getType, arrayOf } = require('@semapps/ldp');
const { collectionPermissionsWithAnonRead, getSlugFromUri, objectIdToCurrent } = require('../../../utils');
const { ACTOR_TYPES } = require('../../../constants');
const AwaitActivityMixin = require('../../../mixins/await-activity');

const queueOptions =
  process.env.NODE_ENV === 'test'
    ? {}
    : {
        // Keep completed jobs for 3 days
        removeOnComplete: { age: 259200 },
        // Try again after 3 minutes and until 48 hours later
        // Method to calculate it: Math.round((Math.pow(2, attemptsMade) - 1) * delay)
        attempts: 10,
        backoff: { type: 'exponential', delay: '180000' }
      };

const OutboxService = {
  name: 'activitypub.outbox',
  mixins: [AwaitActivityMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    collectionOptions: {
      path: '/outbox',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#outbox',
      ordered: true,
      itemsPerPage: 10,
      dereferenceItems: true,
      sortPredicate: 'as:published',
      sortOrder: 'semapps:DescOrder',
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.object', 'activitypub.collection', 'activitypub.collections-registry'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.collectionOptions);
  },
  actions: {
    async post(ctx) {
      let { collectionUri, username, transient, ...activity } = ctx.params;
      let activityUri;

      const collectionExists = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
      if (!collectionExists) {
        throw new E.NotFoundError();
      }

      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'outbox' });
      if (!actorUri) {
        throw new E.BadRequestError('INVALID_COLLECTION', 'The collection is not a valid ActivityPub outbox');
      }

      // Ensure logged user is posting to his own outbox
      if (ctx.meta.webId && ctx.meta.webId !== 'system' && actorUri !== ctx.meta.webId) {
        throw new E.UnAuthorizedError(
          'UNAUTHORIZED',
          `Forbidden to post to the outbox ${collectionUri} (webId ${ctx.meta.webId})`
        );
      }

      if (this.settings.podProvider) {
        ctx.meta.dataset = getSlugFromUri(actorUri);
      }

      if (!activity['@context']) {
        activity['@context'] = await ctx.call('jsonld.context.get');
      }

      // Wrap object in Create activity, if necessary
      activity = await ctx.call('activitypub.object.wrap', { activity });

      if (!ctx.meta.doNotProcessObject && transient !== true) {
        // Process object create, update or delete
        // and return an activity with the object ID
        activity = await ctx.call('activitypub.object.process', { activity, actorUri });
      }

      if (!activity.actor) {
        activity.actor = actorUri;
      }

      // Use the current time for the activity's publish date
      activity.published = new Date().toISOString();

      if (transient === true) {
        // Object or actor URI + hash with lower case activity
        activityUri = `${activity.object || activity.actor}#${arrayOf(getType(activity))[0].toLowerCase()}`;
        activity = { id: activityUri, ...activity };
      } else {
        const activitiesContainerUri = await ctx.call('activitypub.activity.getContainerUri', {
          webId: actorUri
        });

        // -- Persist Activity --
        // There might be a capability attached which cannot be persisted, if it has a non-resolvable id.
        // So we won't persist it and re-attach it afterwards.
        let { capability, ...activityToPersist } = activity;

        activityUri = await ctx.call('activitypub.activity.post', {
          containerUri: activitiesContainerUri,
          resource: activityToPersist,
          contentType: MIME_TYPES.JSON,
          webId: 'system' // Post as system since there is no write permission to the activities container
        });

        // Refetch because persisting has side-effects.
        // And reattach capability for further processing (if present).
        activity = {
          ...(await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' })),
          capability
        };
      }

      try {
        await ctx.call('activitypub.side-effects.processOutbox', { activity });
      } catch (e) {
        if (transient !== true) {
          await ctx.call('activitypub.activity.delete', { resourceUri: activityUri, webId: 'system' });
        }
        // TODO unprocess objects
        throw e;
      }

      if (transient !== true) {
        // Attach the newly-created activity to the outbox
        await ctx.call('activitypub.collection.add', {
          collectionUri,
          item: activity
        });
      }

      const localRecipients = [];
      const remoteRecipients = [];
      const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });

      for (const recipientUri of recipients) {
        if (this.isLocalActor(recipientUri)) {
          const account = await ctx.call('auth.account.findByWebId', { webId: recipientUri });
          if (account) {
            localRecipients.push(recipientUri);
          } else {
            this.logger.warn(`No local account found with webId ${recipientUri}`);
          }
        } else {
          remoteRecipients.push(recipientUri);
        }
      }

      // Post to remote recipients
      for (const recipientUri of remoteRecipients) {
        this.createJob('remotePost', recipientUri, { recipientUri, activity }, queueOptions);
      }

      // Send this event now, because the localPost method will emit activitypub.inbox.received event
      ctx.emit('activitypub.outbox.posted', { activity }, { meta: { webId: null } });

      // Post to local recipients
      if (localRecipients.length > 0) {
        // Call directly (but without waiting)
        this.localPost(localRecipients, activity);
      }

      return activity;
    },
    async updateCollectionsOptions(ctx) {
      const { dataset } = ctx.params;
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.collectionOptions,
        dataset
      });
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    },
    // TODO put this in the activitypub.inbox service
    async localPost(recipients, activityToPost) {
      // Leave the capability separate because we don't want to store it.
      const { capability, ...activity } = activityToPost;
      const success = [];
      const failures = [];

      try {
        await this.broker.call('activitypub.side-effects.processInbox', { activity: activityToPost, recipients });
      } catch (e) {
        console.error(e);
        // If some processors failed, log error message but don't stop
        this.logger.error(e.message);
      }

      // We do not want the capability persisted...

      for (const recipientUri of recipients) {
        try {
          const account = await this.broker.call('auth.account.findByWebId', { webId: recipientUri });
          if (!account) throw new Error(`No account found with webId ${recipientUri}`);

          const dataset = this.settings.podProvider ? account.username : undefined;

          const recipientInbox = await this.broker.call(
            'activitypub.actor.getCollectionUri',
            {
              actorUri: recipientUri,
              predicate: 'inbox',
              webId: 'system'
            },
            { meta: { dataset } }
          );

          // Attach activity to the inbox of the recipient
          await this.broker.call(
            'activitypub.collection.add',
            {
              collectionUri: recipientInbox,
              item: activity
            },
            { meta: { dataset } }
          );

          if (this.settings.podProvider) {
            // Store the activity in the dataset of the recipient
            await this.broker.call('ldp.remote.store', {
              resource: objectIdToCurrent(activity),
              mirrorGraph: false, // Store in default graph as activity may not be public
              keepInSync: false, // Activities are immutable
              webId: recipientUri,
              dataset
            });

            await this.broker.call(
              'activitypub.activity.attach',
              {
                resourceUri: activity.id,
                webId: recipientUri
              },
              { meta: { dataset } }
            );
          }

          success.push(recipientUri);
        } catch (e) {
          this.logger.warn(`Error when posting activity to local actor ${recipientUri}: ${e.message}`);
          failures.push(recipientUri);
        }
      }

      this.broker.emit('activitypub.inbox.received', { activity: activityToPost, recipients, local: true });

      return { success, failures };
    }
  },
  queues: {
    remotePost: {
      name: '*',
      async process(job) {
        const { activity, recipientUri } = job.data;

        // During tests, do not do post to remote servers
        if (process.env.NODE_ENV === 'test' && !recipientUri.startsWith('http://localhost')) return;

        const recipientInbox = await this.broker.call('activitypub.actor.getCollectionUri', {
          actorUri: recipientUri,
          predicate: 'inbox',
          webId: 'system'
        });

        if (!recipientInbox) {
          throw new Error(`Error when posting activity to remote actor ${recipientUri}: no inbox attached`);
        }

        const body = JSON.stringify(activity);

        const signatureHeaders = await this.broker.call('signature.generateSignatureHeaders', {
          url: recipientInbox,
          method: 'POST',
          body,
          actorUri: activity.actor
        });

        const response = await fetch(recipientInbox, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...signatureHeaders
          },
          body
        });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status} when posting activity ${activity.id} to remote actor ${recipientUri}: ${response.statusText}`
          );
        }

        job.progress(100);

        return { ok: response.ok, status: response.status, statusText: response.statusText };
      }
    }
  }
};

module.exports = OutboxService;
