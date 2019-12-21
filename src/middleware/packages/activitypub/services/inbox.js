'use strict';

const { ACTIVITY_TYPES } = require('../constants');

module.exports = {
  name: 'activitypub.inbox',
  settings: {
    homeUrl: null
  },
  dependencies: ['activitypub.collection'],
  actions: {
    async list(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      return await ctx.call('activitypub.collection.queryOrderedCollection', {
        collectionUri: this.getUri(ctx.params.username),
        optionalTriplesToFetch: `
          ?item as:object ?object .
          ?object ?objectP ?objectO .
        `
      });
    }
  },
  events: {
    'activitypub.outbox.posted'({ activity }) {
      if (activity.to && activity.type === ACTIVITY_TYPES.CREATE) {
        // TODO handle followers list
        const recipients = Array.isArray(activity.to) ? activity.to : [activity.to]
        recipients
          .filter(recipient => recipient.startsWith(this.settings.homeUrl))
          .forEach(recipient => {
            // Attach the activity to the inbox of the recipient
            this.broker.call('activitypub.collection.attach', {
              collectionUri: recipient + '/inbox',
              objectUri: activity.id
            });

            this.broker.emit('activitypub.inbox.received', { recipient, activity });
          });
      }
    }
  },
  methods: {
    getUri(username) {
      return this.settings.homeUrl + 'activitypub/actor/' + username + '/inbox';
    }
  }
};
