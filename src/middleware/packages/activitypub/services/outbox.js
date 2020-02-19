const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../constants');

const OutboxService = {
  name: 'activitypub.outbox',
  dependencies: ['webid', 'activitypub.collection'],
  async started() {
    this.settings.usersContainer = await this.broker.call('webid.getUsersContainer');
  },
  actions: {
    async post(ctx) {
      let { username, ...activity } = ctx.params;

      const collectionExists = await ctx.call('activitypub.collection.exist', {
        collectionUri: this.getOutboxUri(username)
      });

      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      if (Object.values(OBJECT_TYPES).includes(activity.type)) {
        const object = await ctx.call('activitypub.object.create', activity);

        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: 'Create',
          to: object.to,
          actor: object.attributedTo,
          object: object
        };
      } else if (activity.type === ACTIVITY_TYPES.UPDATE) {
        await ctx.call('activitypub.object.update', activity.object);
      } else if (activity.type === ACTIVITY_TYPES.DELETE) {
        await ctx.call('activitypub.object.remove', { id: activity.object });
      }

      // Use the current time for the activity's publish date
      // This will be used to order the ordered collections
      activity.published = new Date().toISOString();

      activity = await ctx.call('activitypub.activity.create', activity);

      // Attach the newly-created activity to the outbox
      ctx.call('activitypub.collection.attach', {
        collectionUri: this.getOutboxUri(username),
        item: activity
      });

      ctx.emit('activitypub.outbox.posted', { activity });

      return activity;
    },
    async list(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: this.getOutboxUri(ctx.params.username)
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  },
  methods: {
    getOutboxUri(username) {
      return this.settings.usersContainer + username + '/outbox';
    }
  }
};

module.exports = OutboxService;
