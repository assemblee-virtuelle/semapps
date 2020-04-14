const urlJoin = require('url-join');
const { ACTIVITY_TYPES } = require('../constants');

const FollowService = {
  name: 'activitypub.follow',
  settings: {
    actorsContainer: null
  },
  dependencies: ['activitypub.actor', 'activitypub.collection'],
  actions: {
    async listFollowers(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: urlJoin(this.settings.actorsContainer, ctx.params.username, 'followers'),
        dereferenceItems: false
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
        id: urlJoin(this.settings.actorsContainer, ctx.params.username, 'following'),
        dereferenceItems: false
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
          collectionUri: urlJoin(activity.object, 'followers'),
          item: activity.actor
        });
        await this.broker.call('activitypub.collection.attach', {
          collectionUri: urlJoin(activity.actor, 'following'),
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
