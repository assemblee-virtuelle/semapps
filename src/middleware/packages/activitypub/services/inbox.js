const { MIME_TYPES } = require('@semapps/mime-types');
const { objectIdToCurrent, collectionPermissionsWithAnonRead } = require('../utils');
const ControlledCollectionMixin = require('../mixins/controlled-collection');
const { ACTOR_TYPES } = require('../constants');

const InboxService = {
  name: 'activitypub.inbox',
  mixins: [ControlledCollectionMixin],
  settings: {
    path: '/inbox',
    attachToTypes: Object.values(ACTOR_TYPES),
    attachPredicate: 'http://www.w3.org/ns/ldp#inbox',
    ordered: true,
    itemsPerPage: 10,
    dereferenceItems: true,
    sort: { predicate: 'as:published', order: 'DESC' },
    permissions: collectionPermissionsWithAnonRead
  },
  dependencies: ['activitypub.collection', 'triplestore'],
  actions: {
    async post(ctx) {
      let { collectionUri, ...activity } = ctx.params;

      // Ensure the actor in the activity is the same as the posting actor
      // (When posting, the webId is the one of the poster)
      if (activity.actor !== ctx.meta.webId) {
        ctx.meta.$statusMessage = 'Activity actor is not the same as the posting actor';
        ctx.meta.$statusCode = 401;
      }

      // We want the next operations to be done by the system
      ctx.meta.webId = 'system';

      // Remember inbox owner (used by WebACL middleware)
      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'inbox' });

      const collectionExists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      if (!ctx.meta.skipSignatureValidation) {
        const validDigest = await ctx.call('signature.verifyDigest', {
          body: ctx.meta.rawBody, // Stored by parseJson middleware
          headers: ctx.meta.headers
        });

        const { isValid: validSignature } = await ctx.call('signature.verifyHttpSignature', {
          url: collectionUri,
          method: 'POST',
          headers: ctx.meta.headers
        });

        if (!validDigest || !validSignature) {
          ctx.meta.$statusCode = 401;
          return;
        }
      }

      // TODO check activity is valid

      // Save the remote activity in the local triple store
      await ctx.call('ldp.remote.store', {
        resource: objectIdToCurrent(activity),
        mirrorGraph: false, // Store in default graph as activity may not be public
        keepInSync: false, // Activities are immutable
        webId: actorUri
      });

      // Attach the activity to the activities container, in order to use the container options
      await ctx.call('activitypub.activity.attach', { resourceUri: activity.id, webId: actorUri });

      // Attach the activity to the inbox
      await ctx.call('activitypub.collection.attach', {
        collectionUri,
        item: activity
      });

      ctx.emit(
        'activitypub.inbox.received',
        {
          activity,
          recipients: [actorUri]
        },
        { meta: { webId: null, dataset: null } }
      );

      ctx.meta.$statusCode = 202;
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

      let activities = [];

      for (const activityUri of results.filter(node => node.activityUri).map(node => node.activityUri.value)) {
        const activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });
        activities.push(activity);
      }

      return activities;
    }
  }
};

module.exports = InboxService;
