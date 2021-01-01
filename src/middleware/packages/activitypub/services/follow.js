const urlJoin = require('url-join');
const { ACTIVITY_TYPES } = require('../constants');

const FollowService = {
  name: 'activitypub.follow',
  settings: {
    baseUri: null
  },
  dependencies: ['activitypub.actor', 'activitypub.collection'],
  actions: {
    async listFollowers(ctx) {
      let { username, containerUri } = ctx.params;

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: urlJoin(containerUri, username, 'followers'),
        dereferenceItems: false
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async listFollowing(ctx) {
      let { username, containerUri } = ctx.params;

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: urlJoin(containerUri, username, 'following'),
        dereferenceItems: false
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { activity } = ctx.params;
      const activityType = activity.type || activity['@type'];

      switch (activityType) {
        case ACTIVITY_TYPES.FOLLOW: {
          const { '@context': context, username, ...activityObject } = activity;

          await ctx.call('activitypub.outbox.post', {
            collectionUri: urlJoin(activity.object, 'outbox'),
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: activity.object,
            type: ACTIVITY_TYPES.ACCEPT,
            object: activityObject,
            to: activity.actor
          });

          break;
        }

        case ACTIVITY_TYPES.ACCEPT: {
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;

            if (this.isLocalActor(followActivity.actor)) {
              await this.broker.call('activitypub.collection.attach', {
                collectionUri: urlJoin(followActivity.actor, 'following'),
                item: followActivity.object
              });
            }

            if (this.isLocalActor(followActivity.object)) {
              await this.broker.call('activitypub.collection.attach', {
                collectionUri: urlJoin(followActivity.object, 'followers'),
                item: followActivity.actor
              });
            }

            this.broker.emit('activitypub.follow.added', {
              follower: followActivity.actor,
              following: followActivity.object
            });
          }
          break;
        }

        case ACTIVITY_TYPES.UNDO:
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;

            if (this.isLocalActor(followActivity.object)) {
              await this.broker.call('activitypub.collection.detach', {
                collectionUri: urlJoin(followActivity.object, 'followers'),
                item: followActivity.actor
              });
            }

            if (this.isLocalActor(followActivity.actor)) {
              await this.broker.call('activitypub.collection.detach', {
                collectionUri: urlJoin(followActivity.actor, 'following'),
                item: followActivity.object
              });
            }

            this.broker.emit('activitypub.follow.removed', {
              follower: followActivity.actor,
              following: followActivity.object
            });
          }
          break;
      }
    },
    'activitypub.follow.added'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    },
    'activitypub.follow.removed'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
};

module.exports = FollowService;
