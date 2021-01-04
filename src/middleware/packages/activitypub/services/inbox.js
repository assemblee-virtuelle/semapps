const urlJoin = require('url-join');
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
      let { username, containerUri: actorContainerUri, collectionUri, ...activity } = ctx.params;
      const actorUri = urlJoin(actorContainerUri, username);

      if ((!username || !actorContainerUri) && !collectionUri) {
        throw new Error('A username/containerUri or collectionUri must be specified');
      }

      collectionUri = collectionUri || urlJoin(actorUri, 'inbox');

      const collectionExists = await ctx.call('activitypub.collection.exist', {
        collectionUri: collectionUri
      });

      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      const validDigest = await ctx.call('signature.verifyDigest', {
        body: JSON.stringify(activity),
        headers: ctx.meta.headers
      });

      const validSignature = await ctx.call('signature.verifyHttpSignature', {
        url: collectionUri,
        headers: ctx.meta.headers
      });

      if (!validDigest || !validSignature) {
        ctx.meta.$statusCode = 401;
        return;
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
      let { username, containerUri: actorContainerUri, collectionUri, page } = ctx.params;

      if (!username && !collectionUri) {
        throw new Error('A username or collectionUri must be specified');
      }

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: collectionUri || urlJoin(actorContainerUri, username, 'inbox'),
        page,
        itemsPerPage: this.settings.itemsPerPage,
        dereferenceItems: true,
        queryDepth: 3
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
