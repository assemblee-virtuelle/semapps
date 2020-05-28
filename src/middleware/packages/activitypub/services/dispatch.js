const urlJoin = require('url-join');
const QueueService = require('moleculer-bull');
const { setQueues } = require('bull-board');
const { PUBLIC_URI } = require('../constants');
const { defaultToArray } = require('../utils');

const DispatchService = {
  name: 'activitypub.dispatch',
  mixins: [QueueService('redis://localhost:6379')],
  settings: {
    actorsContainer: null
  },
  dependencies: ['activitypub.collection'],
  started() {
    setQueues(Object.values(this.$queues));
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;

      if (activity.to) {
        const recipients = await this.getAllRecipients(activity);
        for (const recipientUri of recipients) {
          // TODO find inbox URI from the actor's profile
          const inboxUri = urlJoin(recipientUri, 'inbox');
          if (this.isLocalActor(recipientUri)) {
            // Attach activity to the inbox of the local actor
            await this.broker.call('activitypub.collection.attach', {
              collectionUri: inboxUri,
              item: activity
            });
          } else {
            this.createJob('remote.post', { inboxUri, activity });
          }
        }

        this.broker.emit('activitypub.inbox.received', { activity, recipients });
      }
    },
    'activitypub.inbox.received'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  },
  methods: {
    getFollowersUri(actorUri) {
      return urlJoin(actorUri, 'followers');
    },
    isLocalActor(uri) {
      return uri.startsWith(this.settings.actorsContainer);
    },
    async getAllRecipients(activity) {
      let output = [],
        recipients = defaultToArray(activity.to);
      for (const recipient of recipients) {
        if (recipient === PUBLIC_URI || recipient === 'as:Public' || recipient === 'Public') {
          // Public URI. No need to add to inbox.
          // We accept all three representations https://www.w3.org/TR/activitypub/#public-addressing
          continue;
        } else if (activity.actor && recipient === this.getFollowersUri(activity.actor)) {
          // Followers list. Add the list of followers.
          const collection = await this.broker.call('activitypub.collection.get', { id: recipient });
          if (collection && collection.items) output.push(...defaultToArray(collection.items));
        } else {
          // Simple actor URI
          output.push(recipient);
        }
      }
      return output;
    }
  },
  queues: {
    // Post activity to the inbox of the distant actor
    async 'remote.post'(job) {
      // TODO add Json-LD signature

      await fetch(job.data.inboxUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job.data.activity)
      });

      job.progress(100);

      return {
        done: true,
        id: job.data.id,
        worker: process.pid
      };
    }
  }
};

module.exports = DispatchService;
