'use strict';

const { PUBLIC_URI } = require('../constants');

module.exports = {
  name: 'activitypub.inbox',
  settings: {
    usersContainer: null
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
        for (const recipient of recipients) {
          // Attach the activity to the inbox of the recipient
          await this.broker.call('activitypub.collection.attach', {
            collectionUri: recipient + '/inbox',
            objectUri: activity.id
          });
        }
        this.broker.emit('activitypub.inbox.received', { activity, recipients });
      }
    },
    'activitypub.inbox.received'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  },
  methods: {
    getInboxUri(username) {
      return this.settings.usersContainer + username + '/inbox';
    },
    getFollowersUri(actorUri) {
      return actorUri + '/followers';
    },
    isLocalUri(uri) {
      return uri.startsWith(this.settings.usersContainer);
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
      return output.filter(this.isLocalUri);
    }
  }
};
