'use strict';

const { ACTIVITY_TYPES } = require('../constants');

const FollowService = {
  name: 'activitypub.follow',
  dependencies: ['activitypub.actor', 'activitypub.collection'],
  async started() {
    this.settings.actorsContainer = await this.broker.call('activitypub.actor.getContainerUri');
  },
  actions: {
    async listFollowers(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: `${this.settings.actorsContainer}${ctx.params.username}/followers`
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async listFollowing(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: `${this.settings.actorsContainer}${ctx.params.username}/following`
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;

      if (activity.type === ACTIVITY_TYPES.FOLLOW || activity['@type'] === ACTIVITY_TYPES.FOLLOW) {
        await this.broker.call('activitypub.collection.attach', {
          collectionUri: activity.object + '/followers',
          item: activity.actor
        });
        await this.broker.call('activitypub.collection.attach', {
          collectionUri: activity.actor + '/following',
          item: activity.object
        });
        this.broker.emit('activitypub.follow.added', { follower: activity.actor });
      }
    },
    'activitypub.follow.added'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = FollowService;
