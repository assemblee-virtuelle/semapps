const { MIME_TYPES } = require('@semapps/mime-types');
const { objectCurrentToId, objectIdToCurrent } = require('../utils');

const InboxService = {
  name: 'activitypub.inbox',
  settings: {
    itemsPerPage: 10
  },
  dependencies: ['activitypub.collection', 'triplestore'],
  actions: {
    async post(ctx) {
      let { collectionUri, ...activity } = ctx.params;

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
          headers: ctx.meta.headers
        });

        if (!validDigest || !validSignature) {
          ctx.meta.$statusCode = 401;
          return;
        }
      }

      // TODO check activity is valid

      // Save the remote activity in the local triple store
      // TODO see if we could cache it elsewhere
      await ctx.call('triplestore.insert', {
        resource: objectIdToCurrent(activity),
        contentType: MIME_TYPES.JSON
      });

      // Attach the activity to the inbox
      ctx.call('activitypub.collection.attach', {
        collectionUri,
        item: activity
      });

      ctx.emit('activitypub.inbox.received', {
        activity,
        recipients: [actorUri]
      });

      ctx.meta.$statusCode = 202;
    },
    async list(ctx) {
      let { collectionUri, page } = ctx.params;

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        collectionUri,
        page,
        itemsPerPage: this.settings.itemsPerPage,
        dereferenceItems: true,
        queryDepth: 3,
        sort: { predicate: 'as:published', order: 'DESC' }
      });

      if (collection) {
        collection.orderedItems =
          collection.orderedItems && collection.orderedItems.map(activityJson => objectCurrentToId(activityJson));
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  }
};

module.exports = InboxService;
