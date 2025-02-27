const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('../../../constants');
const { collectionPermissionsWithAnonRead } = require('../../../utils');
const matchActivity = require('../../../utils/matchActivity');

const ShareService = {
  name: 'activitypub.share',
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
    async addShare(ctx) {
      const { objectUri, announce } = ctx.params;

      // Create the /shares collection and attach it to the object, unless it already exists
      const collectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
        objectUri,
        collection: this.settings.collectionOptions,
        webId: 'system'
      });

      // Add the announce to the shares collection
      await ctx.call('activitypub.collection.add', { collectionUri, item: announce.id });
    },
    async removeShare(ctx) {
      const { objectUri, announce } = ctx.params;

      const object = await ctx.call('activitypub.object.get', { objectUri });

      // If a shares collection is attached to the object, detach the announce
      if (object?.shares) {
        await ctx.call('activitypub.collection.remove', {
          collectionUri: object.shares,
          item: announce.id
        });
      }
    },
    async updateCollectionsOptions(ctx) {
      const { dataset } = ctx.params;
      await ctx.call('activitypub.collections-registry.updateCollectionsOptions', {
        collection: this.settings.collectionOptions,
        dataset
      });
    }
  },
  activities: {
    shareObject: {
      async match(activity, fetcher) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            // looking for an announce activity targeting any object
            type: ACTIVITY_TYPES.ANNOUNCE,
            object: {}
          },
          activity,
          fetcher
        );
        return { match, dereferencedActivity };
      },
      async onReceive(ctx, activity) {
        await this.actions.addShare({ objectUri: activity.object.id, announce: activity }, { parentCtx: ctx });
      }
    },
    unshareObject: {
      async match(activity, fetcher) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            // looking for an undo activity targeting an announce activity targeting any object
            type: ACTIVITY_TYPES.UNDO,
            object: {
              type: ACTIVITY_TYPES.ANNOUNCE,
              object: {
                object: {}
              }
            }
          },
          activity,
          fetcher
        );
        return { match, dereferencedActivity };
      },
      async onReceive(ctx, activity) {
        await this.actions.removeShare(
          { objectUri: activity.object.object.id, announce: activity.object },
          { parentCtx: ctx }
        );
      }
    }
  }
};

module.exports = ShareService;
