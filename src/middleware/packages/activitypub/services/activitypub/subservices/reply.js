const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('../../../constants');
const { collectionPermissionsWithAnonRead } = require('../../../utils');
const matchActivity = require('../../../utils/matchActivity');

const ReplyService = {
  name: 'activitypub.reply',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    podProvider: false,
    collectionOptions: {
      path: '/replies',
      attachPredicate: 'https://www.w3.org/ns/activitystreams#replies',
      ordered: false,
      dereferenceItems: true,
      permissions: collectionPermissionsWithAnonRead
    }
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  actions: {
    async addReply(ctx) {
      const { objectUri, replyUri } = ctx.params;

      // Create the /replies collection and attach it to the object, unless it already exists
      const collectionUri = await ctx.call('activitypub.collections-registry.createAndAttachCollection', {
        objectUri,
        collection: this.settings.collectionOptions,
        webId: 'system'
      });

      await ctx.call('activitypub.collection.add', { collectionUri, item: replyUri });
    },
    async removeReply(ctx) {
      const { objectUri, replyUri } = ctx.params;

      const object = await ctx.call('activitypub.object.get', { objectUri });

      // Remove the reply only if a /replies collection was attached to the object
      if (object.replies) {
        await ctx.call('activitypub.collection.remove', { collectionUri: object.replies, item: replyUri });
      }
    },
    async removeFromAllRepliesCollections(ctx) {
      const { objectUri } = ctx.params;

      await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          DELETE {
            ?collection as:items <${objectUri}> .
          } 
          WHERE {
            ?collection as:items <${objectUri}> .
            ?collection a as:Collection .
            ?object as:replies ?collection .
          }
        `,
        webId: 'system'
      });
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
    postReply: {
      async match(activity, fetcher) {
        const { match, dereferencedActivity } = await matchActivity(
          {
            type: ACTIVITY_TYPES.CREATE,
            object: {
              type: OBJECT_TYPES.NOTE
            }
          },
          activity,
          fetcher
        );
        // We have a match only if there is a inReplyTo predicate to the object
        return { match: match && dereferencedActivity.object.inReplyTo, dereferencedActivity };
      },
      async onEmit(ctx, activity, emitterUri) {
        if (this.isLocalObject(activity.object.inReplyTo, emitterUri)) {
          await this.actions.addReply(
            { objectUri: activity.object.inReplyTo, replyUri: activity.object.id },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx, activity, recipientUri) {
        if (this.isLocalObject(activity.object.inReplyTo, recipientUri)) {
          await this.actions.addReply(
            { objectUri: activity.object.inReplyTo, replyUri: activity.object.id },
            { parentCtx: ctx }
          );
        }
      }
    },
    deleteNote: {
      match: {
        type: ACTIVITY_TYPES.DELETE,
        object: {
          type: OBJECT_TYPES.TOMBSTONE,
          formerType: 'as:Note' // JSON-LD doesn't remove prefixes for subjects
        }
      },
      async onEmit(ctx, activity) {
        await this.actions.removeFromAllRepliesCollections({ objectUri: activity.object.id }, { parentCtx: ctx });
      },
      async onReceive(ctx, activity) {
        await this.actions.removeFromAllRepliesCollections({ objectUri: activity.object.id }, { parentCtx: ctx });
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
          uri.startsWith(actorUri + '/') ||
          uri === aclBase ||
          uri.startsWith(aclBase + '/') ||
          uri === aclGroupBase ||
          uri.startsWith(aclGroupBase + '/')
        );
      } else {
        return uri.startsWith(this.settings.baseUri);
      }
    }
  }
};

module.exports = ReplyService;
