const { MoleculerError } = require('moleculer').Errors;

const OutboxService = {
  name: 'activitypub.outbox',
  settings: {
    itemsPerPage: 10
  },
  dependencies: ['activitypub.object', 'activitypub.collection'],
  actions: {
    async post(ctx) {
      let { collectionUri, ...activity } = ctx.params;

      const collectionExists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExists) {
        throw new MoleculerError('Collection not found:' + collectionUri, 404, 'NOT_FOUND');
      }

      // Ensure logged user is posting to his own outbox
      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'outbox' });
      if (ctx.meta.webId && ctx.meta.webId !== 'system' && actorUri !== ctx.meta.webId) {
        throw new MoleculerError('You are not allowed to post to this outbox', 403, 'FORBIDDEN');
      }

      // Process object create, update or delete
      // and return an activity with the object ID
      activity = await ctx.call('activitypub.object.process', { activity, actorUri });

      // Use the current time for the activity's publish date
      // TODO use it to order the ordered collections
      activity.published = new Date().toISOString();

      const activityUri = await ctx.call('activitypub.activity.create', { activity });
      activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri });

      // Attach the newly-created activity to the outbox
      await ctx.call('activitypub.collection.attach', {
        collectionUri,
        item: activity
      });

      ctx.emit('activitypub.outbox.posted', { activity });

      ctx.meta.$responseHeaders = {
        Location: activityUri,
        'Content-Length': 0
      };

      ctx.meta.$statusCode = 201;

      // TODO do not return activity when calling through the HTTP
      return activity;
    },
    async list(ctx) {
      let { collectionUri, page } = ctx.params;

      const collection = await ctx.call('activitypub.collection.get', {
        collectionUri,
        page,
        itemsPerPage: this.settings.itemsPerPage,
        dereferenceItems: true,
        isActivity: true,
        sort: { predicate: 'as:published', order: 'DESC' }
      });

      if (collection) {
        ctx.meta.$responseType = 'application/ld+json';
        return collection;
      } else {
        throw new MoleculerError('Collection not found', 404, 'NOT_FOUND');
      }
    }
  }
};

module.exports = OutboxService;
