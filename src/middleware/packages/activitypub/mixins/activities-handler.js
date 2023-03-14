const matchActivity = require('../utils/matchActivity');
const { getSlugFromUri } = require("../utils");

const ActivitiesHandlerMixin = {
  started() {
    if (!this.schema.activities || this.schema.activities.length === 0) {
      throw new Error('ActivitiesHandlerMixin: no activities defined in the service ' + this.name);
    }
  },
  methods: {
    matchActivity(ctx, pattern, activityOrObject) {
      return matchActivity(ctx, pattern, activityOrObject);
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitterUri = activity.actor;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onEmit) {
          ctx.meta.webId = emitterUri;
          ctx.meta.dataset = getSlugFromUri(emitterUri);

          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await this.matchActivity(ctx, activityHandler.match, activity)
              : await activityHandler.match.bind(this)(ctx, activity);

          if (dereferencedActivity) {
            this.logger.info(`Emission of activity "${key}" detected`);
            await activityHandler.onEmit.bind(this)(ctx, dereferencedActivity, emitterUri);
          }
        }
      }
    },
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients } = ctx.params;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onReceive) {
          // Use dataset of first user to dereference activity
          // TODO handle non-POD provider config
          ctx.meta.webId = recipients[0];
          ctx.meta.dataset = getSlugFromUri(recipients[0]);

          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await this.matchActivity(ctx, activityHandler.match, activity)
              : await activityHandler.match.bind(this)(ctx, activity);

          if (dereferencedActivity) {
            this.logger.info(`Reception of activity "${key}" detected`);

            for (let recipientUri of recipients) {
              ctx.meta.webId = recipientUri;
              ctx.meta.dataset = getSlugFromUri(recipientUri);
              await activityHandler.onReceive.bind(this)(ctx, dereferencedActivity, recipientUri);
            }
          }
        }
      }
    }
  }
};

module.exports = ActivitiesHandlerMixin;
