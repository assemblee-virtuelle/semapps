import { ServiceSchema } from 'moleculer';
import ActivitiesHandlerMixin from '../../../mixins/activities-handler.ts';
import { ACTIVITY_TYPES, ACTOR_TYPES } from '../../../constants.ts';
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';
import { CollectionRegistration } from '../../../types.ts';

const LikeService = {
  name: 'activitypub.like' as const,
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    likesCollectionOptions: {
      path: '/likes',
      attachPredicate: 'https://www.w3.org/ns/activitystreams#likes',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    } as CollectionRegistration,
    likedCollectionOptions: {
      path: '/liked',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#liked',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    } as CollectionRegistration
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.likedCollectionOptions);
  },
  actions: {
    addObjectToActorLikedCollection: {
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const actor: any = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, attach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }
    },

    addActorToObjectLikesCollection: {
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const likesCollectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
          objectUri,
          collection: this.settings.likesCollectionOptions
        });

        await ctx.call('activitypub.collection.add', {
          collectionUri: likesCollectionUri,
          item: actorUri
        });
      }
    },

    removeObjectFromActorLikedCollection: {
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const actor: any = await ctx.call('activitypub.actor.get', { actorUri });

        // If a liked collection is attached to the actor, detach the object
        if (actor.liked) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: actor.liked,
            item: objectUri
          });
        }
      }
    },

    removeActorFromObjectLikesCollection: {
      async handler(ctx) {
        const { actorUri, objectUri } = ctx.params;

        const object: any = await ctx.call('activitypub.object.get', { objectUri, actorUri });

        // If a likes collection is attached to the object, detach the actor
        if (object.likes) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: object.likes,
            item: actorUri
          });
        }
      }
    },

    updateCollectionsOptions: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          collection: this.settings.likesCollectionOptions,
          dataset
        });
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          collection: this.settings.likedCollectionOptions,
          dataset
        });
      }
    }
  },
  activities: {
    likeObject: {
      match: {
        type: ACTIVITY_TYPES.LIKE
      },
      async onEmit(ctx: any, activity: any) {
        if (!activity?.object) throw new Error(`No object in the Like activity`);

        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.addObjectToActorLikedCollection(
          { actorUri: activity.actor, objectUri: activity.object },
          { parentCtx: ctx }
        );

        const recipientsUris = await ctx.call('activitypub.activity.getRecipients', { activity });
        const isRemoteObject = await ctx.call('ldp.remote.isRemote', { resourceUri: activity.object });

        // If the actor is liking their own object without recipients, add them immediately to the likes collection
        if (recipientsUris.length === 0 && !isRemoteObject) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.addActorToObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx: any, activity: any) {
        if (!activity?.object) throw new Error(`No object in the Like activity`);

        if (!(await ctx.call('ldp.remote.isRemote', { resourceUri: activity.object }))) {
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
      async onEmit(ctx: any, activity: any) {
        if (!activity.object?.object) throw new Error(`No object in the Like activity`);

        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.removeObjectFromActorLikedCollection(
          { actorUri: activity.actor, objectUri: activity.object.object },
          { parentCtx: ctx }
        );

        const recipientsUris = await ctx.call('activitypub.activity.getRecipients', { activity });
        const isRemoteObject = await ctx.call('ldp.remote.isRemote', { resourceUri: activity.object.object });

        // If the actor is unliking their own object without recipients, remove them immediately from the likes collection
        if (recipientsUris.length === 0 && !isRemoteObject) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.removeActorFromObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object.object },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx: any, activity: any) {
        if (!activity.object?.object) throw new Error(`No object in the Like activity`);

        if (!(await ctx.call('ldp.remote.isRemote', { resourceUri: activity.object.object }))) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
          await this.actions.removeActorFromObjectLikesCollection(
            { actorUri: activity.actor, objectUri: activity.object.object },
            { parentCtx: ctx }
          );
        }
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
