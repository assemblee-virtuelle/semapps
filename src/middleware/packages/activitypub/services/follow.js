'use strict';

const { ACTIVITY_TYPES } = require('../constants');

module.exports = {
  name: 'activitypub.follow',
  settings: {
    homeUrl: null
  },
  dependencies: ['activitypub.collection'],
  actions: {
    async listFollowers(ctx) {
      ctx.meta.$responseType = 'application/json';

      return await ctx.call('activitypub.collection.queryCollection', {
        collectionUri: this.settings.homeUrl + 'activitypub/followers'
      });
    }
  },
  events: {
    'activitypub.outbox.posted'({ activity }) {
      if (activity.type === ACTIVITY_TYPES.FOLLOW) {
        this.broker.call('activitypub.collection.attach', {
          collectionUri: this.settings.homeUrl + 'activitypub/followers',
          objectUri: activity.object
        });
      }
    }
  }
};
