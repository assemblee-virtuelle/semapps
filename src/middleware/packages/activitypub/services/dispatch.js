const fetch = require('node-fetch');
const { delay } = require('../utils');

const DispatchService = {
  name: 'activitypub.dispatch',
  settings: {
    baseUri: null,
    podProvider: false,
    // Delay before dispatching (0 for immediate dispatch)
    // This is useful if we want onEmit side effects to run first
    delay: 0,
  },
  dependencies: ['activitypub.collection'],
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      let localRecipients = [];

      if( this.settings.delay ) {
        await delay(this.settings.delay);
      }

      const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });
      for (const recipientUri of recipients) {
        const recipientInbox = await ctx.call('activitypub.actor.getCollectionUri', {
          actorUri: recipientUri,
          predicate: 'inbox',
          webId: 'system'
        });
        if (this.isLocalActor(recipientUri)) {
          // Attach activity to the inbox of the local actor
          await ctx.call('activitypub.collection.attach', {
            collectionUri: recipientInbox,
            item: activity
          });
          localRecipients.push(recipientUri);
        } else {
          // If the QueueService mixin is available, use it
          if (this.createJob) {
            this.createJob('remotePost', activity.actor, { inboxUri: recipientInbox, activity });
          } else {
            // Send directly
            await this.remotePost(recipientUri + '/inbox', activity);
          }
        }
      }

      if (localRecipients.length > 0) {
        // If the QueueService mixin is available, use it
        if (this.createJob) {
          this.createJob('localPost', activity.actor, { activity, recipients: localRecipients });
        } else {
          this.broker.emit('activitypub.inbox.received', { activity, recipients: localRecipients });
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
    async remotePost(inboxUri, activity) {
      const body = JSON.stringify(activity);

      const signatureHeaders = await this.broker.call('signature.generateSignatureHeaders', {
        url: inboxUri,
        method: 'POST',
        body,
        actorUri: activity.actor
      });

      // Post activity to the inbox of the remote actor
      return await fetch(inboxUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...signatureHeaders
        },
        body
      });
    }
  },
  queues: {
    remotePost: {
      name: '*',
      async process(job) {
        const { activity, inboxUri } = job.data;
        const response = await this.remotePost(inboxUri, activity);

        if (!response.ok) {
          job.moveToFailed({ message: 'Unable to send to remote host ' + inboxUri }, true);
        } else {
          job.progress(100);
        }

        return {response};
      },
    },
    localPost: {
      name: '*',
      async process(job) {
        const { activity, recipients } = job.data;
        await this.broker.emit('activitypub.inbox.received', { activity, recipients });
        job.progress(100);
      }
    }
  }
};

module.exports = DispatchService;
