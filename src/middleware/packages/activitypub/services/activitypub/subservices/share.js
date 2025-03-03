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
      const { objectUri, sharingActorUri } = ctx.params;

      // Create the /shares collection and attach it to the object, unless it already exists
      const collectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
        objectUri,
        collection: this.settings.collectionOptions,
        webId: 'system'
      });

      await ctx.call('activitypub.collection.add', { collectionUri, item: sharingActorUri });
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
    postShare: {
      async match(activity, fetcher) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            type: ACTIVITY_TYPES.ANNOUNCE,
            object: {
              type: OBJECT_TYPES.NOTE
            }
          },
          activity,
          fetcher
        );
        return { match, dereferencedActivity };
      },
      async onReceive(ctx, activity) {
        await this.actions.addShare(
          { objectUri: activity.object.id, sharingActorUri: activity.actor },
          { parentCtx: ctx }
        );
      }
    }
  }
};

module.exports = ShareService;
