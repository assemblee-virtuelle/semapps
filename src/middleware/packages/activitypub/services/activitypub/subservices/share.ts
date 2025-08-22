import { ServiceSchema } from 'moleculer';
import ActivitiesHandlerMixin from '../../../mixins/activities-handler.ts';
import { ACTIVITY_TYPES, OBJECT_TYPES } from '../../../constants.ts';
import { collectionPermissionsWithAnonRead } from '../../../utils.ts';
import matchActivity from '../../../utils/matchActivity.ts';

const ShareService = {
  name: 'activitypub.share' as const,
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    collectionOptions: {
      path: '/shares',
      attachPredicate: 'https://www.w3.org/ns/activitystreams#shares',
      ordered: false,
      dereferenceItems: false,
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  actions: {
    addShare: {
      async handler(ctx) {
        const { objectUri, announce } = ctx.params;

        // Create the /shares collection and attach it to the object, unless it already exists
        const collectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
          objectUri,
          collection: this.settings.collectionOptions,
          webId: 'system'
        });

        // Add the announce to the shares collection
        await ctx.call('activitypub.collection.add', { collectionUri, item: announce.id });
      }
    },

    removeShare: {
      async handler(ctx) {
        const { objectUri, announce } = ctx.params;

        const object = await ctx.call('activitypub.object.get', { objectUri });

        // If a shares collection is attached to the object, detach the announce
        if (object?.shares) {
          await ctx.call('activitypub.collection.remove', {
            collectionUri: object.shares,
            item: announce.id
          });
        }
      }
    },

    updateCollectionsOptions: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
          collection: this.settings.collectionOptions,
          dataset
        });
      }
    }
  },
  activities: {
    shareObject: {
      async match(activity: any, fetcher: any) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            // looking for an announce activity
            type: ACTIVITY_TYPES.ANNOUNCE
          },
          activity,
          fetcher
        );
        return {
          // @ts-expect-error TS(2339): Property 'broker' does not exist on type '{ match(... Remove this comment to see the full error message
          match: match && (await this.broker.call('activitypub.activity.isPublic', { activity })),
          dereferencedActivity
        };
      },
      async onReceive(ctx: any, activity: any) {
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.addShare({ objectUri: activity.object, announce: activity }, { parentCtx: ctx });
      }
    },
    unshareObject: {
      async match(activity: any, fetcher: any) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            // looking for an undo activity targeting an announce activity
            type: ACTIVITY_TYPES.UNDO,
            object: {
              type: ACTIVITY_TYPES.ANNOUNCE
            }
          },
          activity,
          fetcher
        );
        return { match, dereferencedActivity };
      },
      async onReceive(ctx: any, activity: any) {
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type '{ match... Remove this comment to see the full error message
        await this.actions.removeShare(
          { objectUri: activity.object?.object, announce: activity.object },
          { parentCtx: ctx }
        );
      }
    }
  }
} satisfies ServiceSchema;

export default ShareService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ShareService.name]: typeof ShareService;
    }
  }
}
