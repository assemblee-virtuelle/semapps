const ActivitiesHandlerMixin = require('../../../mixins/activities-handler');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('../../../constants');
const { collectionPermissionsWithAnonRead } = require('../../../utils');
const matchActivity = require('../../../utils/matchActivity');

const ReplyService = {
  name: 'activitypub.reply',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    attachToObjectTypes: null
  },
  dependencies: ['activitypub.outbox', 'activitypub.collection'],
  async started() {
    const { attachToObjectTypes } = this.settings;
    await this.broker.call('activitypub.registry.register', {
      path: '/replies',
      attachToTypes: attachToObjectTypes,
      attachPredicate: 'https://www.w3.org/ns/activitystreams#replies',
      ordered: false,
      dereferenceItems: true,
      permissions: collectionPermissionsWithAnonRead
    });
  },
  actions: {
    async addReply(ctx) {
      const { objectUri, replyUri } = ctx.params;

      const object = await ctx.call('activitypub.object.get', { objectUri });

      await ctx.call('activitypub.collection.attach', { collectionUri: object.replies, item: replyUri });
    },
    async removeReply(ctx) {
      const { objectUri, replyUri } = ctx.params;

      const object = await ctx.call('activitypub.object.get', { objectUri });

      await ctx.call('activitypub.collection.detach', { collectionUri: object.replies, item: replyUri });
    }
  },
  activities: {
    postReply: {
      match(ctx, activity) {
        return matchActivity(
          ctx,
          {
            type: ACTIVITY_TYPES.CREATE,
            object: {
              type: OBJECT_TYPES.NOTE,
              inReplyTo: {
                type: this.settings.attachToObjectTypes
              }
            }
          },
          activity
        );
      },
      async onEmit(ctx, activity) {
        if (this.isLocalObject(activity.object.inReplyTo.id)) {
          await this.actions.addReply(
            { objectUri: activity.object.inReplyTo.id, replyUri: activity.object.id },
            { parentCtx: ctx }
          );
        }
      },
      async onReceive(ctx, activity) {
        if (this.isLocalObject(activity.object.inReplyTo.id)) {
          await this.actions.addReply(
            { objectUri: activity.object.inReplyTo.id, replyUri: activity.object.id },
            { parentCtx: ctx }
          );
        }
      }
    },
    deleteReply: {
      match(ctx, activity) {
        return matchActivity(
          ctx,
          {
            type: ACTIVITY_TYPES.DELETE,
            object: {
              type: OBJECT_TYPES.NOTE,
              inReplyTo: {
                type: this.settings.attachToObjectTypes
              }
            }
          },
          activity
        );
      },
      async onEmit(ctx, activity, emitterUri) {
        await this.actions.removeReply(
          { objectUri: activity.object.inReplyTo.id, replyUri: activity.object.id },
          { parentCtx: ctx }
        );
      }
    }
  },
  methods: {
    isLocalObject(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
};

module.exports = ReplyService;
