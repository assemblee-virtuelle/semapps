const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');
const { ACTIVITY_TYPES } = require('../../../constants');
const { collectionPermissionsWithAnonRead } = require('../../../utils');

const LikeService = {
  name: 'activitypub.like',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    attachToActorTypes: null,
    likesCollectionOptions: {
      path: '/likes',
      attachPredicate: 'https://www.w3.org/ns/activitystreams#likes',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    const { attachToActorTypes } = this.settings;

    await this.broker.call('activitypub.registry.register', {
      path: '/liked',
      attachToTypes: attachToActorTypes,
      attachPredicate: 'https://www.w3.org/ns/activitystreams#liked',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    });
  },
  actions: {
    async addLike(ctx) {
      const { actorUri, objectUri } = ctx.params;

      if (this.isLocal(actorUri)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, attach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }

      if (this.isLocal(objectUri)) {
        // Create the /likes collection and attach it to the object, unless it already exists
        const likesCollectionUri = await ctx.call('activitypub.registry.createAndAttachCollection', {
          objectUri,
          collection: this.settings.likesCollectionOptions
        });

        await ctx.call('activitypub.collection.add', {
          collectionUri: likesCollectionUri,
          item: actorUri
        });
      }

      ctx.emit('activitypub.like.added', { actorUri, objectUri }, { meta: { webId: null, dataset: null } });
    },
    async removeLike(ctx) {
      const { actorUri, objectUri } = ctx.params;

      if (this.isLocal(actorUri)) {
        const actor = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, detach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }

      if (this.isLocal(objectUri)) {
        const object = await ctx.call('activitypub.object.get', { objectUri, actorUri });
        // If a likes collection is attached to the object, detach the actor
        if (object.likes) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: object.likes,
            item: actorUri
          });
        }
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
      },
      async onReceive(ctx, activity) {
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
      },
      async onReceive(ctx, activity) {
        await this.actions.removeLike(
          { actorUri: activity.actor, objectUri: activity.object.object },
          { parentCtx: ctx }
        );
      }
    }
  },
  methods: {
    isLocal(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
};

module.exports = LikeService;
