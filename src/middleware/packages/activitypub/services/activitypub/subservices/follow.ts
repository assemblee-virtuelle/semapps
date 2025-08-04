const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');
const { ACTIVITY_TYPES, ACTOR_TYPES } = require('../../../constants');
const { collectionPermissionsWithAnonRead } = require('../../../utils');

const FollowService = {
  name: 'activitypub.follow',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    followersCollectionOptions: {
      path: '/followers',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#followers',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    },
    followingCollectionOptions: {
      path: '/following',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#following',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.followersCollectionOptions);
    await this.broker.call('activitypub.collections-registry.register', this.settings.followingCollectionOptions);
  },
  actions: {
    async addFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: following });
        if (actor.followers) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: actor.followers,
            item: follower
          });
        }
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
        if (actor.following) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: actor.following,
            item: following
          });
        }
      }

      ctx.emit('activitypub.follow.added', { follower, following }, { meta: { webId: null, dataset: null } });
    },
    async removeFollower(ctx) {
      const { follower, following } = ctx.params;

      if (this.isLocalActor(following)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: following });
        if (actor.followers) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: actor.followers,
            item: follower
          });
        }
      }

      // Add reverse relation
      if (this.isLocalActor(follower)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
        if (actor.following) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: actor.following,
            item: following
          });
        }
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
        resourceUri: collectionUri
      });
    },
    async listFollowing(ctx) {
      const { collectionUri } = ctx.params;

      return await ctx.call('activitypub.collection.get', {
        resourceUri: collectionUri
      });
    },
    async updateCollectionsOptions(ctx) {
      const { dataset } = ctx.params;
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.followersCollectionOptions,
        dataset
      });
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.followingCollectionOptions,
        dataset
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

        await this.actions.addFollower(
          {
            follower: activity.actor,
            following: activity.object
          },
          { parentCtx: ctx }
        );

        // TODO don't accept Follow request if actor doesn't have followers/following collections
        await ctx.call('activitypub.outbox.post', {
          collectionUri: actor.outbox,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: activity.object,
          type: ACTIVITY_TYPES.ACCEPT,
          object: activityObject,
          to: activity.actor
        });
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
      async onEmit(ctx, activity) {
        await this.actions.removeFollower(
          {
            follower: activity.object.actor || activity.actor,
            following: activity.object.object
          },
          { parentCtx: ctx }
        );
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
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
};

module.exports = FollowService;
