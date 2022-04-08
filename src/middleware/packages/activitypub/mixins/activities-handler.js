const matchActivity = require('../utils/matchActivity');

const ActivitiesHandlerMixin = {
  started() {
    if (!this.schema.activities || this.schema.activities.length === 0) {
      throw new Error('ActivitiesHandlerMixin: no activities defined in the service ' + this.name);
    }
  },
  methods: {
    matchActivity
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitter = activity.actor;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onEmit) {
          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await matchActivity(ctx, activityHandler.match, activity)
              : await activityHandler.match.bind(this)(activity);

          if (dereferencedActivity) {
            this.logger.info(`Emission of activity "${key}" detected`);
            await activityHandler.onEmit.bind(this)(ctx, dereferencedActivity, emitter);
          }
        }
      }
    },
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients } = ctx.params;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onReceive) {
          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await matchActivity(ctx, activityHandler.match, activity)
              : await activityHandler.match.bind(this)(activity);

          if (dereferencedActivity) {
            this.logger.info(`Reception of activity "${key}" detected`);
            await activityHandler.onReceive.bind(this)(ctx, dereferencedActivity, recipients);
          }
        }
      }
    }
  }
};

module.exports = ActivitiesHandlerMixin;
