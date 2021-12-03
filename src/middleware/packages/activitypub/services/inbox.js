const { MIME_TYPES } = require('@semapps/mime-types');
const { objectCurrentToId, objectIdToCurrent } = require('../utils');
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
    permissions: {}
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

      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'inbox' });

      const collectionExists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      if (!ctx.meta.skipSignatureValidation) {
        const validDigest = await ctx.call('signature.verifyDigest', {
          body: JSON.stringify(activity),
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
      await ctx.call('triplestore.insert', {
        resource: objectIdToCurrent(activity),
        contentType: MIME_TYPES.JSON
      });

      // Attach the activity to the inbox
      ctx.call('activitypub.collection.attach', {
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
    }
  }
};

module.exports = InboxService;
