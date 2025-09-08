import { Errors as E } from 'moleculer-web';
const { MoleculerError } = require('moleculer').Errors;
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';
import { ACTOR_TYPES } from '../../../constants.ts';
import AwaitActivityMixin from '../../../mixins/await-activity.ts';
import { ServiceSchema, defineAction } from 'moleculer';

/** @type {import('moleculer').ServiceSchema} */
const InboxService = {
  name: 'activitypub.inbox' as const,
  mixins: [AwaitActivityMixin],
  settings: {
    podProvider: false,
    collectionOptions: {
      path: '/inbox',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'http://www.w3.org/ns/ldp#inbox',
      ordered: true,
      itemsPerPage: 10,
      dereferenceItems: true,
      sortPredicate: 'as:published',
      sortOrder: 'semapps:DescOrder',
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.collection', 'activitypub.collections-registry'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.collectionOptions);
  },
  actions: {
    post: defineAction({
      async handler(ctx) {
        const { collectionUri, ...activity } = ctx.params;

        if (!collectionUri || !collectionUri.startsWith('http')) {
          throw new Error(`The collectionUri ${collectionUri} is not a valid URL`);
        }

        if (!(await ctx.call('ldp.resource.exist', { resourceUri: collectionUri, webId: 'system' }))) {
          throw E.NotFoundError();
        }

        // Ensure the actor in the activity is the same as the posting actor
        // (When posting, the webId is the one of the poster)
        if (activity.actor !== ctx.meta.webId) {
          throw new E.UnAuthorizedError('INVALID_ACTOR', 'Activity actor is not the same as the posting actor');
        }

        const inboxOwner = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'inbox' });

        // Verify that the account exists and has not been deleted
        const account = await ctx.call('auth.account.findByWebId', { webId: inboxOwner });
        if (!account) throw new E.NotFoundError();
        if (account.deletedAt) throw new MoleculerError(`User does not exist anymore`, 410, 'GONE');

        if (this.settings.podProvider) {
          ctx.meta.dataset = account.username;
        }

        // We want the next operations to be done by the system
        // TODO check if we can avoid this, as this is a bad practice
        ctx.meta.webId = 'system';

        const collectionExists = await ctx.call('activitypub.collection.exist', {
          resourceUri: collectionUri,
          webId: 'system'
        });
        if (!collectionExists) {
          throw new E.NotFoundError();
        }

        if (!ctx.meta.skipSignatureValidation) {
          if (!ctx.meta.rawBody || !ctx.meta.originalHeaders)
            throw new Error(`Cannot validate HTTP signature because of missing meta (rawBody or originalHeaders)`);

          const validDigest = await ctx.call('signature.verifyDigest', {
            body: ctx.meta.rawBody, // Stored by parseRawBody middleware
            headers: ctx.meta.originalHeaders
          });

          const { isValid: validSignature } = await ctx.call('signature.verifyHttpSignature', {
            url: collectionUri,
            method: 'POST',
            headers: ctx.meta.originalHeaders
          });

          if (!validDigest || !validSignature) {
            throw new E.UnAuthorizedError('INVALID_SIGNATURE');
          }
        }

        // TODO check activity is valid

        try {
          await this.broker.call('activitypub.side-effects.processInbox', { activity, recipients: [inboxOwner] });
        } catch (e) {
          // If some processors failed, log error message but don't stop
          this.logger.error(e.message);
        }

        // If this is a transient activity, we have no way to retrieve it
        // so do not store it in the inbox (Mastodon works the same way)
        if (activity.id && !activity.id.includes('#')) {
          // Save the remote activity in the local triple store
          await ctx.call('ldp.remote.store', {
            resource: activity,
            keepInSync: false, // Activities are immutable
            webId: inboxOwner
          });

          // Attach the activity to the activities container, in order to use the container options
          await ctx.call('activitypub.activity.attach', {
            resourceUri: activity.id,
            webId: this.settings.podProvider ? inboxOwner : 'system'
          });

          // Attach the activity to the inbox
          await ctx.call('activitypub.collection.add', {
            collectionUri,
            item: activity
          });
        } else {
          // If the activity cannot be retrieved, pass the full object
          // This will be used in particular for Solid notifications
          // which will send the full activity to the listeners
          ctx.emit(
            'activitypub.collection.added',
            {
              collectionUri,
              item: activity
            },
            { meta: { webId: null, dataset: null } }
          );
        }

        ctx.emit(
          'activitypub.inbox.received',
          {
            activity,
            recipients: [inboxOwner],
            local: false
          },
          { meta: { webId: null, dataset: null } }
        );
      }
    }),

    getByDates: defineAction({
      async handler(ctx) {
        const { collectionUri, fromDate, toDate } = ctx.params;

        const filters = [];
        if (fromDate) filters.push(`?published >= "${fromDate.toISOString()}"^^xsd:dateTime`);
        if (toDate) filters.push(`?published < "${toDate.toISOString()}"^^xsd:dateTime`);

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            SELECT DISTINCT ?activityUri 
            WHERE {
              GRAPH <${collectionUri}> {
                <${collectionUri}> a as:Collection .
                <${collectionUri}> as:items ?activityUri . 
              }
              GRAPH ?g {
                ?activityUri as:published ?published . 
                ${filters ? `FILTER (${filters.join(' && ')})` : ''}
              }
            }
            ORDER BY ?published
          `,
          webId: 'system'
        });

        const activities = [];

        for (const activityUri of results.filter(node => node.activityUri).map(node => node.activityUri.value)) {
          const activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });
          activities.push(activity);
        }

        return activities;
      }
    }),

    updateCollectionsOptions: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          collection: this.settings.collectionOptions,
          dataset
        });
      }
    })
  }
} satisfies ServiceSchema;

export default InboxService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [InboxService.name]: typeof InboxService;
    }
  }
}
