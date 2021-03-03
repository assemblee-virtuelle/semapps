const urlJoin = require('url-join');
const { ACTIVITY_TYPES } = require('../constants');

const FollowService = {
  name: 'activitypub.follow',
  settings: {
    baseUri: null
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  actions: {
    async listFollowers(ctx) {
      let { username, containerUri: actorContainerUri, collectionUri } = ctx.params;

      if ((!username || !actorContainerUri) && !collectionUri) {
        throw new Error('Outbox post: a username/containerUri or collectionUri must be specified');
      }

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: collectionUri || urlJoin(actorContainerUri, username, 'followers'),
        dereferenceItems: false
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async listFollowing(ctx) {
      let { username, containerUri: actorContainerUri, collectionUri } = ctx.params;

      if ((!username || !actorContainerUri) && !collectionUri) {
        throw new Error('Outbox post: a username/containerUri or collectionUri must be specified');
      }

      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.get', {
        id: collectionUri || urlJoin(actorContainerUri, username, 'following'),
        dereferenceItems: false
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async addFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        await ctx.call('activitypub.collection.attach', {
          collectionUri: urlJoin(following, 'followers'),
          item: follower
        });
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        await ctx.call('activitypub.collection.attach', {
          collectionUri: urlJoin(follower, 'following'),
          item: following
        });
      }

      ctx.emit('activitypub.follow.added', { follower, following });
    },
    async removeFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        await ctx.call('activitypub.collection.detach', {
          collectionUri: urlJoin(following, 'followers'),
          item: follower
        });
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        await ctx.call('activitypub.collection.detach', {
          collectionUri: urlJoin(follower, 'following'),
          item: following
        });
      }

      ctx.emit('activitypub.follow.removed', { follower, following });
    }
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { activity } = ctx.params;
      const activityType = activity.type || activity['@type'];

      switch (activityType) {
        case ACTIVITY_TYPES.FOLLOW: {
          if (this.isLocalActor(activity.object)) {
            const { '@context': context, username, ...activityObject } = activity;
            await ctx.call('activitypub.outbox.post', {
              collectionUri: urlJoin(activity.object, 'outbox'),
              '@context': 'https://www.w3.org/ns/activitystreams',
              actor: activity.object,
              type: ACTIVITY_TYPES.ACCEPT,
              object: activityObject,
              to: activity.actor
            });
            await this.actions.addFollower({
              follower: activity.actor,
              following: activity.object
            }, { parentCtx: ctx });
          }
          break;
        }

        case ACTIVITY_TYPES.ACCEPT: {
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;
            await this.actions.addFollower({
              follower: followActivity.actor,
              following: followActivity.object
            }, { parentCtx: ctx });
          }
          break;
        }

        case ACTIVITY_TYPES.UNDO:
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;
            await this.actions.removeFollower({
              follower: followActivity.actor,
              following: followActivity.object
            }, { parentCtx: ctx });
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
