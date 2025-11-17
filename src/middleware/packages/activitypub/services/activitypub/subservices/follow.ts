import { ServiceSchema } from 'moleculer';
import ActivitiesHandlerMixin from '../../../mixins/activities-handler.ts';
import { ACTIVITY_TYPES, ACTOR_TYPES } from '../../../constants.ts';
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';
import { CollectionRegistration } from '../../../types.ts';

const FollowService = {
  name: 'activitypub.follow' as const,
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
    } as CollectionRegistration,
    followingCollectionOptions: {
      path: '/following',
      attachToTypes: Object.values(ACTOR_TYPES),
      attachPredicate: 'https://www.w3.org/ns/activitystreams#following',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    } as CollectionRegistration
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    await this.broker.call('activitypub.collections-registry.register', this.settings.followersCollectionOptions);
    await this.broker.call('activitypub.collections-registry.register', this.settings.followingCollectionOptions);
  },
  actions: {
    isFollowing: {
      async handler(ctx) {
        const { follower, following } = ctx.params;

        if (!this.isLocalActor(follower))
          throw new Error('The method activitypub.follow.isFollowing currently only works with local actors');

        const actor = await ctx.call('activitypub.actor.get', { actorUri: follower });
        return await ctx.call('activitypub.collection.includes', {
          collectionUri: actor.following,
          itemUri: following
        });
      }
    },

    listFollowers: {
      async handler(ctx) {
        const { collectionUri } = ctx.params;

        return await ctx.call('activitypub.collection.get', {
          resourceUri: collectionUri
        });
      }
    },

    listFollowing: {
      async handler(ctx) {
        const { collectionUri } = ctx.params;

        return await ctx.call('activitypub.collection.get', {
          resourceUri: collectionUri
        });
      }
    },

    updateCollectionsOptions: {
      async handler(ctx) {
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
    }
  },
  activities: {
    follow: {
      match: {
        type: ACTIVITY_TYPES.FOLLOW
      },
      async onReceive(ctx: any, activity: any, recipientUri: string) {
        const { '@context': context, ...activityObject } = activity;

        const recipient = await ctx.call('activitypub.actor.get', { actorUri: recipientUri });

        if (recipient.followers) {
          await ctx.call('activitypub.collection.add', {
            collectionUri: recipient.followers,
            item: activity.actor
          });

          await ctx.call('activitypub.outbox.post', {
            collectionUri: recipient.outbox,
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: activity.object,
            type: ACTIVITY_TYPES.ACCEPT,
            object: activityObject,
            to: activity.actor
          });
        }
      }
    },
    acceptFollow: {
      match: {
        type: ACTIVITY_TYPES.ACCEPT,
        object: {
          type: ACTIVITY_TYPES.FOLLOW
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: string) {
        const recipient = await ctx.call('activitypub.actor.get', { actorUri: recipientUri });

        if (recipient.following) {
          // TODO Check that the recipient is indeed in the emitter's followers list ?
          await ctx.call('activitypub.collection.add', {
            collectionUri: recipient.following,
            item: activity.actor
          });
        }
      }
    },
    undoFollow: {
      match: {
        type: ACTIVITY_TYPES.UNDO,
        object: {
          type: ACTIVITY_TYPES.FOLLOW
        }
      },
      async onEmit(ctx: any, activity: any, emitterUri: string) {
        const emitter = await ctx.call('activitypub.actor.get', { actorUri: emitterUri });

        if (emitter.following) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: emitter.following,
            item: activity.object.object
          });
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: string) {
        const recipient = await ctx.call('activitypub.actor.get', { actorUri: recipientUri });

        if (recipient.followers) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: recipient.followers,
            item: activity.actor
          });
        }
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
      async onReceive(ctx: any, activity: any, recipientUri: string) {
        const recipient = await ctx.call('activitypub.actor.get', { actorUri: recipientUri });

        if (recipient.following) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: recipient.following,
            item: activity.actor
          });
        }
      }
    }
  },
  methods: {
    isLocalActor(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
} satisfies ServiceSchema;

export default FollowService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [FollowService.name]: typeof FollowService;
    }
  }
}
