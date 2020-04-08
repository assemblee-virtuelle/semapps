const { PUBLIC_URI } = require('../constants');
const { objectCurrentToId } = require('../functions');

const InboxService = {
  name: 'activitypub.inbox',
  dependencies: ['activitypub.actor', 'activitypub.collection'],
  async started() {
    this.settings.actorsContainer = await this.broker.call('activitypub.actor.getContainerUri');
  },
  actions: {
    async post(ctx) {
      let { username, collectionUri, ...activity } = ctx.params;

      if (!username && !collectionUri) {
        throw new Error('Inbox post: a username or collectionUri must be specified');
      }

      const collectionExists = await ctx.call('activitypub.collection.exist', {
        collectionUri: collectionUri || this.getInboxUri(username)
      });

      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      // TODO check JSON-LD signature
      // TODO check object is valid

      // Attach the newly-created activity to the inbox
      ctx.call('activitypub.collection.attach', {
        collectionUri: collectionUri || this.getInboxUri(username),
        item: activity
      });

      ctx.emit('activitypub.inbox.received', { activity, recipients: [this.settings.actorsContainer + username] });

      return activity;
    },
    async list(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: this.getInboxUri(ctx.params.username),
        dereferenceItems: true,
        expand: ['as:object']
      });

      if (collection) {
        return {
          ...collection,
          orderedItems: collection.orderedItems.map(activityJson => objectCurrentToId(activityJson))
        };
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;

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
      return this.settings.actorsContainer + username + '/inbox';
    },
    getFollowersUri(actorUri) {
      return actorUri + '/followers';
    },
    isLocalUri(uri) {
      return uri.startsWith(this.settings.actorsContainer);
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
