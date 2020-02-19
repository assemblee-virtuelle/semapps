'use strict';

const { PUBLIC_URI } = require('../constants');

const InboxService = {
  name: 'activitypub.inbox',
  dependencies: ['webid', 'activitypub.collection'],
  async started() {
    this.settings.usersContainer = await this.broker.call('webid.getUsersContainer');
  },
  actions: {
    async list(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: this.getInboxUri(ctx.params.username)
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
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
            item: activity
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
    defaultToArray(value) {
      // Items or recipients may be string or array, so default to array for easier handling
      return Array.isArray(value) ? value : [value];
    },
    async getAllRecipients(activity) {
      let output = [],
        recipients = this.defaultToArray(activity.to);
      for (const recipient of recipients) {
        if (recipient === PUBLIC_URI) {
          // Public URI. No need to add to inbox.
          continue;
        } else if (recipient === this.getFollowersUri(activity.actor)) {
          // Followers list. Add the list of followers.
          const collection = await this.broker.call('activitypub.collection.get', { id: recipient });
          if (collection && collection.items) output.push(...this.defaultToArray(collection.items));
        } else {
          // Simple actor URI
          output.push(recipient);
        }
      }
      return output.filter(this.isLocalUri);
    }
  }
};

module.exports = InboxService;
