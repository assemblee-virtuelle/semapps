const fetch = require('node-fetch');
const { Errors: E } = require('moleculer-web');
const { MIME_TYPES } = require('@semapps/mime-types');
const { collectionPermissionsWithAnonRead, getSlugFromUri, objectIdToCurrent } = require('../../../utils');
const { ACTOR_TYPES } = require('../../../constants');

const OutboxService = {
  name: 'activitypub.outbox',
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
      let { collectionUri, ...activity } = ctx.params;

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

      if (!ctx.meta.doNotProcessObject) {
        // Process object create, update or delete
        // and return an activity with the object ID
        activity = await ctx.call('activitypub.object.process', { activity, actorUri });
      }

      if (!activity.actor) {
        activity.actor = actorUri;
      }

      // Use the current time for the activity's publish date
      // TODO use it to order the ordered collections
      activity.published = new Date().toISOString();

      const activitiesContainerUri = await ctx.call('activitypub.activity.getContainerUri', {
        webId: actorUri
      });

      const activityUri = await ctx.call('activitypub.activity.post', {
        containerUri: activitiesContainerUri,
        resource: activity,
        contentType: MIME_TYPES.JSON,
        webId: 'system' // Post as system since there is no write permission to the activities container
      });

      activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });

      // Attach the newly-created activity to the outbox
      await ctx.call('activitypub.collection.add', {
        collectionUri,
        item: activity
      });

      const localRecipients = [];
      const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });

      // Post to remote recipients
      for (const recipientUri of recipients) {
        if (this.isLocalActor(recipientUri)) {
          if (this.settings.podProvider) {
            const podExist = await this.broker.call('pod.exist', { webId: recipientUri });
            if (podExist) {
              localRecipients.push(recipientUri);
            } else {
              this.logger.warn(`No local Pod found with webId ${recipientUri}`);
            }
          } else {
            localRecipients.push(recipientUri);
          }
        } else {
          // If the QueueService mixin is available, use it
          if (this.createJob) {
            this.createJob('remotePost', activity.actor, { recipientUri, activity });
          } else {
            // Send directly (but without waiting)
            this.remotePost(recipientUri, activity);
          }
        }
      }

      // Send this event now, because the localPost method will emit activitypub.inbox.received event
      ctx.emit('activitypub.outbox.posted', { activity }, { meta: { webId: null } });

      // Post to local recipients
      if (localRecipients.length > 0) {
        // If the QueueService mixin is available, use it
        if (this.createJob) {
          this.createJob('localPost', activity.actor, { recipients: localRecipients, activity });
        } else {
          // Call directly (but without waiting)
          this.localPost(localRecipients, activity);
        }
      }

      return activity;
    },
    async updateCollectionsOptions(ctx) {
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.collectionOptions
      });
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    },
    async localPost(recipients, activity) {
      const success = [];
      const failures = [];

      for (const recipientUri of recipients) {
        try {
          const dataset = this.settings.podProvider ? getSlugFromUri(recipientUri) : undefined;

          if (this.settings.podProvider) {
            const podExist = await this.broker.call('pod.exist', { username: dataset });
            if (!podExist) throw new Error(`No Pod found with username ${dataset}`);
          }

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

      this.broker.emit('activitypub.inbox.received', { activity, recipients, local: true });

      return { success, failures };
    },
    async remotePost(recipientUri, activity) {
      // During tests, do not do post to remote servers
      if (process.env.NODE_ENV === 'test' && !recipientUri.startsWith('http://localhost')) return;

      try {
        const recipientInbox = await this.broker.call('activitypub.actor.getCollectionUri', {
          actorUri: recipientUri,
          predicate: 'inbox',
          webId: 'system'
        });

        if (!recipientInbox) {
          this.logger.warn(`Error when posting activity to remote actor ${recipientUri}: no inbox attached`);
          return false;
        }

        const body = JSON.stringify(activity);

        const signatureHeaders = await this.broker.call('signature.generateSignatureHeaders', {
          url: recipientInbox,
          method: 'POST',
          body,
          actorUri: activity.actor
        });

        // Post activity to the inbox of the remote actor
        const response = await fetch(recipientInbox, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...signatureHeaders
          },
          body
        });

        if (response.ok) {
          return true;
        } else {
          this.logger.warn(`Error when posting activity to remote actor ${recipientUri}: ${response.statusText}`);
          return false;
        }
      } catch (e) {
        console.error(e);
        this.logger.warn(`Error when posting activity to remote actor ${recipientUri}: ${e.message}`);
        return false;
      }
    }
  },
  queues: {
    remotePost: {
      name: '*',
      async process(job) {
        const { activity, recipientUri } = job.data;
        const response = await this.remotePost(recipientUri, activity);

        if (!response.ok) {
          job.moveToFailed({ message: `Unable to send to remote actor ${recipientUri}` }, true);
        } else {
          job.progress(100);
        }

        return { response };
      }
    },
    localPost: {
      name: '*',
      async process(job) {
        const { activity, recipients } = job.data;
        const { success, failures } = await this.localPost(recipients, activity);

        if (success.length === 0) {
          job.moveToFailed({ message: 'No local recipients could be reached' }, true);
        } else {
          job.progress(100);
        }

        return { success, failures };
      }
    }
  }
};

module.exports = OutboxService;
