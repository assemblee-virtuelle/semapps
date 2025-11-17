import fetch from 'node-fetch';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { Account } from '@semapps/auth';
import { MIME_TYPES } from '@semapps/mime-types';
import { getType, arrayOf, getDatasetFromUri, isWebId } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';
import { ACTOR_TYPES } from '../../../constants.ts';
import AwaitActivityMixin from '../../../mixins/await-activity.ts';

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
  name: 'activitypub.outbox' as const,
  mixins: [AwaitActivityMixin],
  settings: {
    baseUrl: null,
    collectionOptions: {
      path: '/outbox',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#outbox',
      ordered: true,
      itemsPerPage: 10,
      dereferenceItems: true,
      sortPredicate: 'as:published',
      sortOrder: 'semapps:DescOrder',
      permissions: collectionPermissionsWithAnonRead,
      controlledActions: {
        post: 'activitypub.api.outbox'
      }
    }
  },
  dependencies: ['activitypub.collections-registry'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.collectionOptions);
  },
  actions: {
    post: {
      async handler(ctx) {
        let { collectionUri, username, transient, ...activity } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';

        let activityUri;

        // If the collection URI is not provided, find it from the webId (may happen if this action is called directly)
        if (!collectionUri) {
          if (!isWebId(webId)) throw Error(`If containerUri is not provided, a webId is required. Provided: ${webId}`);
          collectionUri = await this.actions.getUri({ objectUri: webId }, { parentCtx: ctx });
        }

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

        // TODO Handle this with middleware
        ctx.meta.dataset = getDatasetFromUri(collectionUri);

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

          // Refetch because persisting has side-effects
          activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });

          // Reattach capability for further processing
          if (capability) activity.capability = capability;
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
        const recipients: string[] = await ctx.call('activitypub.activity.getRecipients', { activity });

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
      }
    },

    updateCollectionsOptions: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          collection: this.settings.collectionOptions,
          dataset
        });
      }
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUrl);
    },
    // TODO put this in the activitypub.inbox service
    async localPost(recipients, activityToPost) {
      // Leave the capability separate because we don't want to store it.
      const { capability, ...activity } = activityToPost;
      const success = [];
      const failures = [];

      for (const recipientUri of recipients) {
        try {
          const account: Account = await this.broker.call('auth.account.findByWebId', { webId: recipientUri });
          if (!account) throw new Error(`No account found with webId ${recipientUri}`);

          const dataset = account.username;

          const recipientInbox = await this.broker.call(
            'activitypub.actor.getCollectionUri',
            {
              actorUri: recipientUri,
              predicate: 'inbox',
              webId: 'system'
            },
            { meta: { dataset } }
          );

          if (activity.id && !activity.id.includes('#')) {
            // Attach activity to the inbox of the recipient
            await this.broker.call(
              'activitypub.collection.add',
              {
                collectionUri: recipientInbox,
                item: activity
              },
              { meta: { dataset } }
            );

            // Store the activity in the dataset of the recipient
            await this.broker.call('ldp.remote.store', {
              resource: activity,
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
          } else {
            // If the activity is transient, pass the full object
            // This will be used in particular for Solid notifications
            // which will send the full activity to the listeners
            this.broker.emit('activitypub.collection.added', {
              collectionUri: recipientInbox,
              item: activity
            });
          }

          success.push(recipientUri);
        } catch (e) {
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
          this.logger.warn(`Error when posting activity to local actor ${recipientUri}: ${e.message}`);
          failures.push(recipientUri);
        }
      }

      try {
        await this.broker.call('activitypub.side-effects.processInbox', { activity: activityToPost, recipients });
      } catch (e) {
        console.error(e);
        // If some processors failed, log error message but don't stop
        // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
        this.logger.error(e.message);
      }

      this.broker.emit('activitypub.inbox.received', { activity: activityToPost, recipients, local: true });

      return { success, failures };
    }
  },
  queues: {
    remotePost: {
      name: '*',
      async process(job: any) {
        const { activity, recipientUri } = job.data;

        const dataset = getDatasetFromUri(activity.actor);

        // During tests, do not do post to remote servers
        if (process.env.NODE_ENV === 'test' && !recipientUri.startsWith('http://localhost')) return;

        const recipientInbox = await this.broker.call(
          'activitypub.actor.getCollectionUri',
          {
            actorUri: recipientUri,
            predicate: 'inbox',
            webId: 'system'
          },
          { meta: { dataset } }
        );

        if (!recipientInbox) {
          throw new Error(`Error when posting activity to remote actor ${recipientUri}: no inbox attached`);
        }

        const body = JSON.stringify(activity);

        const signatureHeaders: any = await this.broker.call(
          'signature.generateSignatureHeaders',
          {
            url: recipientInbox,
            method: 'POST',
            body,
            actorUri: activity.actor
          },
          { meta: { dataset } }
        );

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
} satisfies ServiceSchema;

export default OutboxService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [OutboxService.name]: typeof OutboxService;
    }
  }
}
