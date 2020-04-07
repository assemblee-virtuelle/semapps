const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../constants');

const OutboxService = {
  name: 'activitypub.outbox',
  dependencies: ['activitypub.actor', 'activitypub.collection'],
  async started() {
    this.settings.actorsContainer = await this.broker.call('activitypub.actor.getContainerUri');
  },
  actions: {
    async post(ctx) {
      let { username, collectionUri, ...activity } = ctx.params;
      const activityType = activity.type || activity['@type'];

      if (!username && !collectionUri) {
        throw new Error('Outbox post: a username or collectionUri must be specified');
      }

      const collectionExists = await ctx.call('activitypub.collection.exist', {
        collectionUri: collectionUri || this.getOutboxUri(username)
      });

      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      if (Object.values(OBJECT_TYPES).includes(activityType)) {
        const object = await ctx.call('activitypub.object.create', activity);

        const { to, attributedTo, '@context': context } = activity;
        activity = {
          '@context': context,
          '@type': 'Create',
          to,
          actor: attributedTo,
          object
        };
      }
      // if (activityType === ACTIVITY_TYPES.CREATE) {
      //   
      // } else if (activityType === ACTIVITY_TYPES.UPDATE) {
      //   await ctx.call('activitypub.object.update', activity.object);
      // } else if (activityType === ACTIVITY_TYPES.DELETE) {
      //   await ctx.call('activitypub.object.remove', { id: activity.object });
      // }

      // Use the current time for the activity's publish date
      // This will be used to order the ordered collections
      activity.published = new Date().toISOString();

      activity = await ctx.call('activitypub.activity.create', activity);

      // Attach the newly-created activity to the outbox
      ctx.call('activitypub.collection.attach', {
        collectionUri: collectionUri || this.getOutboxUri(username),
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
      return this.settings.actorsContainer + username + '/outbox';
    }
  }
};

module.exports = OutboxService;
