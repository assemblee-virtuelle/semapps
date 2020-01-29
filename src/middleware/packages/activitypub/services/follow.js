'use strict';

const { ACTIVITY_TYPES } = require('../constants');

module.exports = {
  name: 'activitypub.follow',
  dependencies: ['webid', 'activitypub.collection'],
  async started() {
    this.settings.usersContainer = await this.broker.call('webid.getUsersContainer');
  },
  actions: {
    async listFollowers(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      return await ctx.call('activitypub.collection.queryCollection', {
        collectionUri: `${this.settings.usersContainer}${ctx.params.username}/followers`
      });
    },
    async listFollowing(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      return await ctx.call('activitypub.collection.queryCollection', {
        collectionUri: `${this.settings.usersContainer}${ctx.params.username}/following`
      });
    }
  },
  events: {
    async 'activitypub.outbox.posted'({ activity }) {
      if (activity.type === ACTIVITY_TYPES.FOLLOW) {
        await this.broker.call('activitypub.collection.attach', {
          collectionUri: activity.object + '/followers',
          objectUri: activity.actor
        });
        await this.broker.call('activitypub.collection.attach', {
          collectionUri: activity.actor + '/following',
          objectUri: activity.object
        });
        this.broker.emit('activitypub.follow.added', { follower: activity.actor });
      }
    },
    'activitypub.follow.added'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};
