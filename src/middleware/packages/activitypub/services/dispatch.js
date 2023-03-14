const fetch = require('node-fetch');
const { delay, getSlugFromUri} = require('../utils');

const DispatchService = {
  name: 'activitypub.dispatch',
  settings: {
    baseUri: null,
    podProvider: false,
    // Delay before dispatching (0 for immediate dispatch)
    // This is useful if we want onEmit side effects to run first
    delay: 0
  },
  dependencies: ['activitypub.collection'],
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      let localRecipients = [];

      if (this.settings.delay) {
        await delay(this.settings.delay);
      }

      const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });
      for (const recipientUri of recipients) {
        if (this.isLocalActor(recipientUri)) {
          // If local actor, put in array to batch-send after
          localRecipients.push(recipientUri);
        } else {
          // If the QueueService mixin is available, use it
          if (this.createJob) {
            this.createJob('remotePost', activity.actor, { recipientUri, activity });
          } else {
            // Send directly
            await this.remotePost(recipientUri, activity);
          }
        }
      }

      if (localRecipients.length > 0) {
        // If the QueueService mixin is available, use it
        if (this.createJob) {
          this.createJob('localPost', activity.actor, { recipients: localRecipients, activity });
        } else {
          // Call directly
          await this.localPost(localRecipients, activity);
        }
      }
    },
    'activitypub.inbox.received'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    },
    async localPost(recipients, activity) {
      const success = [],
        failures = [];

      for (const recipientUri of recipients) {
        try {
          const dataset = this.settings.podProvider ? getSlugFromUri(recipientUri) : undefined;

          const recipientInbox = await this.broker.call('activitypub.actor.getCollectionUri', {
            actorUri: recipientUri,
            predicate: 'inbox',
            webId: 'system'
          }, { meta: { dataset } });

          // Attach activity to the inbox of the local actor
          await this.broker.call('activitypub.collection.attach', {
            collectionUri: recipientInbox,
            item: activity
          }, { meta: { dataset } });

          success.push(recipientUri);
        } catch (e) {
          this.logger.warn(`Error when posting activity to local actor ${recipientUri}: ${e.message}`);
          failures.push(recipientUri);
        }
      }

      this.broker.emit('activitypub.inbox.received', { activity, recipients });

      return { success, failures };
    },
    async remotePost(recipientUri, activity) {
      // During tests, do not do post to remote servers
      if (process.env.NODE_ENV === 'test' && !recipientUri.startsWith('http://localhost')) return;

      try {
        const recipientInbox = await this.broker.call('activitypub.actor.getCollectionUri', {
          actorUri: recipientUri,
          predicate: 'inbox',
          webId: 'system'
        });

        if (!recipientInbox) return false;

        const body = JSON.stringify(activity);

        const signatureHeaders = await this.broker.call('signature.generateSignatureHeaders', {
          url: recipientInbox,
          method: 'POST',
          body,
          actorUri: activity.actor
        });

        // Post activity to the inbox of the remote actor
        return await fetch(recipientInbox, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...signatureHeaders
          },
          body
        });
      } catch (e) {
        this.logger.warn(`Error when posting activity to remote actor ${recipientUri}: ${e.message}`);
        return false;
      }
    }
  },
  queues: {
    remotePost: {
      name: '*',
      async process(job) {
        const { activity, recipientUri } = job.data;
        const response = await this.remotePost(recipientUri, activity);

        if (!response.ok) {
          job.moveToFailed({ message: 'Unable to send to remote actor ' + recipientUri }, true);
        } else {
          job.progress(100);
        }

        return { response };
      }
    },
    localPost: {
      name: '*',
      async process(job) {
        const { activity, recipients } = job.data;
        const { success, failures } = await this.localPost(recipients, activity);

        if (success.length === 0) {
          job.moveToFailed({ message: 'No local recipients could be reached' }, true);
        } else {
          job.progress(100);
        }

        return { success, failures };
      }
    }
  }
};

module.exports = DispatchService;
