const { ACTIVITY_TYPES, ACTOR_TYPES } = require('../constants');

const FollowService = {
  name: 'activitypub.follow',
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
      permissions: {}
    });

    await this.broker.call('activitypub.registry.register', {
      path: '/following',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#following',
      ordered: false,
      dereferenceItems: false,
      permissions: {}
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
    }
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { activity } = ctx.params;
      const activityType = activity.type || activity['@type'];

      switch (activityType) {
        case ACTIVITY_TYPES.FOLLOW: {
          if (this.isLocalActor(activity.object)) {
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
          break;
        }

        case ACTIVITY_TYPES.ACCEPT: {
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;
            await this.actions.addFollower(
              {
                follower: followActivity.actor,
                following: followActivity.object
              },
              { parentCtx: ctx }
            );
          }
          break;
        }

        case ACTIVITY_TYPES.UNDO:
          const objectType = activity.object.type || activity.object['@type'];
          if (objectType === ACTIVITY_TYPES.FOLLOW) {
            const followActivity = activity.object;
            await this.actions.removeFollower(
              {
                follower: followActivity.actor,
                following: followActivity.object
              },
              { parentCtx: ctx }
            );
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
