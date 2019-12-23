'use strict';

const { PUBLIC_URI } = require('../constants');

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
        collectionUri: this.getInboxUri(ctx.params.username),
        optionalTriplesToFetch: `
          ?item as:object ?object .
          ?object ?objectP ?objectO .
        `
      });
    }
  },
  events: {
    async 'activitypub.outbox.posted'({ activity }) {
      if (activity.to) {
        const recipients = await this.getAllRecipients(activity);
        recipients.filter(this.isLocalUri).forEach(recipient => {
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
    getInboxUri(username) {
      return this.settings.homeUrl + 'activitypub/actor/' + username + '/inbox';
    },
    getFollowersUri(actorUri) {
      return actorUri + '/followers';
    },
    isLocalUri(uri) {
      return uri.startsWith(this.settings.homeUrl);
    },
    async getAllRecipients(activity) {
      let output = [],
        recipients = Array.isArray(activity.to) ? activity.to : [activity.to];
      for (const recipient of recipients) {
        if (recipient === PUBLIC_URI) {
          // Public URI. No need to add to inbox
          continue;
        } else if (recipient === this.getFollowersUri(activity.actor)) {
          // Followers list. Add the list of followers
          const followers = await this.broker.call('activitypub.collection.queryItems', { collectionUri: recipient });
          if (followers) output.push(...followers);
        } else {
          // Simple actor URI
          output.push(recipient);
        }
      }
      return output;
    }
  }
};
