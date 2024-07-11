const { MIME_TYPES } = require('@semapps/mime-types');
const { getDatasetFromUri } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const { objectIdToCurrent, collectionPermissionsWithAnonRead } = require('../../../utils');
const { ACTOR_TYPES } = require('../../../constants');

/** @type {import('moleculer').ServiceSchema} */
const InboxService = {
  name: 'activitypub.inbox',
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
    async post(ctx) {
      const { collectionUri, ...activity } = ctx.params;

      if (this.settings.podProvider) {
        ctx.meta.dataset = getDatasetFromUri(collectionUri);
      }

      if (!collectionUri || !collectionUri.startsWith('http')) {
        throw new Error(`The collectionUri ${collectionUri} is not a valid URL`);
      }

      // Ensure the actor in the activity is the same as the posting actor
      // (When posting, the webId is the one of the poster)
      if (activity.actor !== ctx.meta.webId) {
        throw new E.UnAuthorizedError('INVALID_ACTOR', 'Activity actor is not the same as the posting actor');
      }

      // We want the next operations to be done by the system
      // TODO check if we can avoid this, as this is a bad practice
      ctx.meta.webId = 'system';

      // Remember inbox owner (used by WebACL middleware)
      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'inbox' });

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
          body: ctx.meta.rawBody, // Stored by parseJson middleware
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
        await this.broker.call('activitypub.side-effects.processInbox', { activity, recipients: [actorUri] });
      } catch (e) {
        // If some processors failed, log error message but don't stop
        this.logger.error(e.message);
      }

      // If this is a transient activity, we have no way to retrieve it
      // so do not store it in the inbox (Mastodon works the same way)
      if (activity.id && !activity.id.includes('#')) {
        // Save the remote activity in the local triple store
        await ctx.call('ldp.remote.store', {
          resource: objectIdToCurrent(activity),
          mirrorGraph: false, // Store in default graph as activity may not be public
          keepInSync: false, // Activities are immutable
          webId: actorUri
        });

        // Attach the activity to the activities container, in order to use the container options
        await ctx.call('activitypub.activity.attach', {
          resourceUri: activity.id,
          webId: this.settings.podProvider ? actorUri : 'system'
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
          recipients: [actorUri],
          local: false
        },
        { meta: { webId: null, dataset: null } }
      );
    },
    async getByDates(ctx) {
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
            <${collectionUri}> a as:Collection .
            <${collectionUri}> as:items ?activityUri . 
            ?activityUri as:published ?published . 
            ${filters ? `FILTER (${filters.join(' && ')})` : ''}
          }
          ORDER BY ?published
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      const activities = [];

      for (const activityUri of results.filter(node => node.activityUri).map(node => node.activityUri.value)) {
        const activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });
        activities.push(activity);
      }

      return activities;
    },
    async updateCollectionsOptions(ctx) {
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.collectionOptions
      });
    }
  }
};

module.exports = InboxService;
