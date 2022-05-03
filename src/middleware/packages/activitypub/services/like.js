const ActivitiesHandlerMixin = require('../mixins/activities-handler');
const { ACTIVITY_TYPES, ACTOR_TYPES, OBJECT_TYPES } = require('../constants');
const { collectionPermissionsWithAnonRead } = require('../utils');

const LikeService = {
  name: 'activitypub.like',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.registry.register', {
      path: '/liked',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#liked',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    });

    await this.broker.call('activitypub.registry.register', {
      path: '/likes',
      attachToTypes: Object.values(OBJECT_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#likes',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    });
  },
  actions: {
    async addLike(ctx) {
      const { actorUri, objectUri } = ctx.params;

      const actor = await ctx.call('activitypub.actor.get', { actorUri });
      const object = await ctx.call('activitypub.object.get', { objectUri, actorUri });

      // If a liked collection is attached to the actor, attach the object
      if (actor.liked) {
        await ctx.call('activitypub.collection.attach', {
          collectionUri: actor.liked,
          item: objectUri
        });
      }

      // If a likes collection is attached to the object, attach the actor
      if (object.likes) {
        await ctx.call('activitypub.collection.attach', {
          collectionUri: object.likes,
          item: actorUri
        });
      }

      ctx.emit('activitypub.like.added', { actorUri, objectUri }, { meta: { webId: null, dataset: null } });
    },
    async removeLike(ctx) {
      const { actorUri, objectUri } = ctx.params;

      const actor = await ctx.call('activitypub.actor.get', { actorUri });
      const object = await ctx.call('activitypub.object.get', { objectUri, actorUri });

      // If a liked collection is attached to the actor, detach the object
      if (actor.liked) {
        await ctx.call('activitypub.collection.detach', {
          collectionUri: actor.liked,
          item: objectUri
        });
      }

      // If a likes collection is attached to the object, detach the actor
      if (object.likes) {
        await ctx.call('activitypub.collection.detach', {
          collectionUri: object.likes,
          item: actorUri
        });
      }

      ctx.emit('activitypub.like.removed', { actorUri, objectUri }, { meta: { webId: null, dataset: null } });
    }
  },
  activities: {
    likeObject: {
      match: {
        type: ACTIVITY_TYPES.LIKE
      },
      async onEmit(ctx, activity) {
        await this.actions.addLike({ actorUri: activity.actor, objectUri: activity.object }, { parentCtx: ctx });
      }
    },
    unlikeObject: {
      match: {
        type: ACTIVITY_TYPES.UNDO,
        object: {
          type: ACTIVITY_TYPES.LIKE
        }
      },
      async onEmit(ctx, activity) {
        await this.actions.removeLike(
          { actorUri: activity.actor, objectUri: activity.object.object },
          { parentCtx: ctx }
        );
      }
    }
  }
};

module.exports = LikeService;
