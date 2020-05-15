const urlJoin = require('url-join');
const { PUBLIC_URI } = require('../constants');
const { defaultToArray } = require('../utils');

const DispatcherService = {
  name: 'activitypub.dispatcher',
  settings: {
    actorsContainer: null
  },
  dependencies: ['activitypub.collection'],
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;

      if (activity.to) {
        const recipients = await this.getAllRecipients(activity);
        for (const recipientUri of recipients) {
          // TODO find inbox URI from the actor's profile
          const inboxUri = urlJoin(recipientUri, 'inbox');
          if( this.isLocalActor(recipientUri) ) {
            // Attach activity to the inbox of the local actor
            await this.broker.call('activitypub.collection.attach', {
              collectionUri: inboxUri,
              item: activity
            });
          } else {
            // Post activity to the inbox of the distant actor
            try {
              // TODO add Json-LD signature

              await fetch(inboxUri, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(activity)
              });
            } catch(e) {
              console.error(e);
              console.log('Could not post activity to URI ' + inboxUri, activity);
            }
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
        if (recipient === PUBLIC_URI) {
          // Public URI. No need to add to inbox.
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
  }
};

module.exports = DispatcherService;
