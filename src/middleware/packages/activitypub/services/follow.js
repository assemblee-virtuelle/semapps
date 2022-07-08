const ActivitiesHandlerMixin = require('../mixins/activities-handler');
const { ACTIVITY_TYPES, ACTOR_TYPES } = require('../constants');
const { collectionPermissionsWithAnonRead } = require('../utils');

const FollowService = {
  name: 'activitypub.follow',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.registry.register', {
      path: '/followers',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#followers',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    });

    await this.broker.call('activitypub.registry.register', {
      path: '/following',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#following',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    });
  },
  actions: {
    async addFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: following });
        await ctx.call('activitypub.collection.attach', {
          collectionUri: actor.followers,
          item: follower
        });
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
        await ctx.call('activitypub.collection.attach', {
          collectionUri: actor.following,
          item: following
        });
      }

      ctx.emit('activitypub.follow.added', { follower, following }, { meta: { webId: null, dataset: null } });
    },
    async removeFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: following });
        await ctx.call('activitypub.collection.detach', {
          collectionUri: actor.followers,
          item: follower
        });
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
        await ctx.call('activitypub.collection.detach', {
          collectionUri: actor.following,
          item: following
        });
      }

      ctx.emit('activitypub.follow.removed', { follower, following }, { meta: { webId: null, dataset: null } });
    },
    async isFollowing(ctx) {
      const { follower, following } = ctx.params;

      if (!this.isLocalActor(follower))
        throw new Error('The method activitypub.follow.isFollowing currently only works with local actors');

      const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
      return await ctx.call('activitypub.collection.includes', {
        collectionUri: actor.following,
        itemUri: following
      });
    },
    async listFollowers(ctx) {
      const { collectionUri } = ctx.params;

      return await ctx.call('activitypub.collection.get', {
        collectionUri
      });
    },
    async listFollowing(ctx) {
      const { collectionUri } = ctx.params;

      return await ctx.call('activitypub.collection.get', {
        collectionUri
      });
    }
  },
  activities: {
    follow: {
      match: {
        type: ACTIVITY_TYPES.FOLLOW
      },
      async onReceive(ctx, activity) {
        const { '@context': context, ...activityObject } = activity;
        const actor = await ctx.call('activitypub.actor.get', { actorUri: activity.object });

        await ctx.call('activitypub.outbox.post', {
          collectionUri: actor.outbox,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: activity.object,
          type: ACTIVITY_TYPES.ACCEPT,
          object: activityObject,
          to: activity.actor
        });

        await this.actions.addFollower(
          {
            follower: activity.actor,
            following: activity.object
          },
          { parentCtx: ctx }
        );
      }
    },
    acceptFollow: {
      match: {
        type: ACTIVITY_TYPES.ACCEPT,
        object: {
          type: ACTIVITY_TYPES.FOLLOW
        }
      },
      async onReceive(ctx, activity) {
        await this.actions.addFollower(
          {
            follower: activity.object.actor,
            following: activity.object.object
          },
          { parentCtx: ctx }
        );
      }
    },
    undoFollow: {
      match: {
        type: ACTIVITY_TYPES.UNDO,
        object: {
          type: ACTIVITY_TYPES.FOLLOW
        }
      },
      async onReceive(ctx, activity) {
        await this.actions.removeFollower(
          {
            follower: activity.object.actor || activity.actor,
            following: activity.object.object
          },
          { parentCtx: ctx }
        );
      }
    },
    undoAcceptFollow: {
      match: {
        type: ACTIVITY_TYPES.UNDO,
        object: {
          type: ACTIVITY_TYPES.ACCEPT,
          object: {
            type: ACTIVITY_TYPES.FOLLOW
          }
        }
      },
      async onReceive(ctx, activity) {
        await this.actions.removeFollower(
          {
            follower: activity.object.object.actor || activity.actor,
            following: activity.object.object.object
          },
          { parentCtx: ctx }
        );
      }
    }
  },
  events: {
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
