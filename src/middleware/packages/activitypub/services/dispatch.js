const fetch = require('node-fetch');
const { delay } = require('../utils');

const DispatchService = {
  name: 'activitypub.dispatch',
  settings: {
    baseUri: null,
    podProvider: false
  },
  dependencies: ['activitypub.collection'],
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      let localRecipients = [];

      // Wait 30 seconds before dispatching the activity, so that onEmit side effects have time to run
      await delay(30000);

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
            this.createJob('remotePost', { inboxUri: recipientInbox, activity });
          } else {
            // Send directly
            await this.remotePost(recipientUri + '/inbox', activity);
          }
        }
      }

      if (localRecipients.length > 0) {
        this.broker.emit('activitypub.inbox.received', { activity, recipients: localRecipients });
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
    async remotePost(job) {
      const response = await this.remotePost(job.data.inboxUri, job.data.activity);

      if (!response.ok) {
        job.moveToFailed({ message: 'Unable to send to remote host ' + job.data.inboxUri }, true);
      } else {
        job.progress(100);
      }

      return {
        response: {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        }
      };
    }
  }
};

module.exports = DispatchService;
