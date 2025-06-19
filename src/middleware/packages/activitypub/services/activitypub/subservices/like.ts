import { ServiceSchema, defineAction } from 'moleculer';
import ActivitiesHandlerMixin from '../../../mixins/activities-handler.ts';
import { ACTIVITY_TYPES, ACTOR_TYPES } from '../../../constants.ts';
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';

const LikeService = {
  name: 'activitypub.like' as const,
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    likesCollectionOptions: {
      path: '/likes',
      attachPredicate: 'https://www.w3.org/ns/activitystreams#likes',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    },
    likedCollectionOptions: {
      path: '/liked',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#liked',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.likedCollectionOptions);
  },
  actions: {
    addObjectToActorLikedCollection: defineAction({
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const actor = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, attach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }
    }),

    addActorToObjectLikesCollection: defineAction({
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const likesCollectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
          objectUri,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          collection: this.settings.likesCollectionOptions
        });

        await ctx.call('activitypub.collection.add', {
          collectionUri: likesCollectionUri,
          item: actorUri
        });
      }
    }),

    removeObjectFromActorLikedCollection: defineAction({
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const actor = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, detach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }
    }),

    removeActorFromObjectLikesCollection: defineAction({
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const object = await ctx.call('activitypub.object.get', { objectUri, actorUri });

        // If a likes collection is attached to the object, detach the actor
        if (object.likes) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: object.likes,
            item: actorUri
          });
        }
      }
    }),

    updateCollectionsOptions: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          collection: this.settings.likesCollectionOptions,
          dataset
        });
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          collection: this.settings.likedCollectionOptions,
          dataset
        });
      }
    })
  },
  activities: {
    likeObject: {
      match: {
        type: ACTIVITY_TYPES.LIKE
      },
      async onEmit(ctx: any, activity: any, emitterUri: any) {
        if (!activity?.object) throw new Error(`No object in the Like activity`);
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.addObjectToActorLikedCollection(
          { actorUri: activity.actor, objectUri: activity.object },
          { parentCtx: ctx }
        );
        // In case there is no recipient, add the actor immediately to the collection
        // @ts-expect-error TS(2339): Property 'isLocalObject' does not exist on type '{... Remove this comment to see the full error message
        if (this.isLocalObject(activity.object, emitterUri)) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.addActorToObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'isLocalObject' does not exist on type '{... Remove this comment to see the full error message
        if (this.isLocalObject(activity.object, recipientUri)) {
          if (!activity?.object) throw new Error(`No object in the Like activity`);
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.addActorToObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object },
            { parentCtx: ctx }
          );
        }
      }
    },
    unlikeObject: {
      match: {
        type: ACTIVITY_TYPES.UNDO,
        object: {
          type: ACTIVITY_TYPES.LIKE
        }
      },
      async onEmit(ctx: any, activity: any, emitterUri: any) {
        if (!activity.object?.object) throw new Error(`No object in the Like activity`);
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.removeObjectFromActorLikedCollection(
          { actorUri: activity.actor, objectUri: activity.object.object },
          { parentCtx: ctx }
        );
        // In case there is no recipient, remove the actor immediately from the collection
        // @ts-expect-error TS(2339): Property 'isLocalObject' does not exist on type '{... Remove this comment to see the full error message
        if (this.isLocalObject(activity.object.object, emitterUri)) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.removeActorFromObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object.object },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'isLocalObject' does not exist on type '{... Remove this comment to see the full error message
        if (this.isLocalObject(activity.object.object, recipientUri)) {
          if (!activity.object?.object) throw new Error(`No object in the Like activity`);
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.removeActorFromObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object.object },
            { parentCtx: ctx }
          );
        }
      }
    }
  },
  methods: {
    isLocalObject(uri, actorUri) {
      if (this.settings.podProvider) {
        const { origin, pathname } = new URL(actorUri);
        const aclBase = `${origin}/_acl${pathname}`; // URL of type http://localhost:3000/_acl/alice
        const aclGroupBase = `${origin}/_groups${pathname}`; // URL of type http://localhost:3000/_groups/alice
        return (
          uri === actorUri ||
          uri.startsWith(`${actorUri}/`) ||
          uri === aclBase ||
          uri.startsWith(`${aclBase}/`) ||
          uri === aclGroupBase ||
          uri.startsWith(`${aclGroupBase}/`)
        );
      } else {
        return uri.startsWith(this.settings.baseUri);
      }
    }
  }
} satisfies ServiceSchema;

export default LikeService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LikeService.name]: typeof LikeService;
    }
  }
}
