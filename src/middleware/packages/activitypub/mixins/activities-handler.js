const matchActivity = require('../utils/matchActivity');

const ActivitiesHandlerMixin = {
  started() {
    if (!this.schema.activities || this.schema.activities.length === 0) {
      throw new Error(`ActivitiesHandlerMixin: no activities defined in the service ${this.name}`);
    }
  },
  methods: {
    matchActivity(ctx, pattern, activityOrObject) {
      return matchActivity(ctx, pattern, activityOrObject);
    },
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitterUri = activity.actor;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onEmit || activityHandler.onReceive) {
          ctx.meta.webId = emitterUri;
          ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: emitterUri });

          if (!activityHandler.match)
            throw new Error(`No match handler (object or function) defined for activity "${key}"`);

          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await this.matchActivity(ctx, activityHandler.match, activity)
              : await activityHandler.match.bind(this)(ctx, activity);

          if (dereferencedActivity) {
            if (activityHandler.onEmit) {
              this.logger.info(`Emission of activity "${key}" by ${emitterUri} detected`);
              await activityHandler.onEmit.bind(this)(ctx, dereferencedActivity, emitterUri);
            }

            // Once onEmit is processed, immediately call onReceive for local recipients
            // We don't use the activitypub.inbox.received event since we have a match, and because activitypub.inbox.received is sent immediately
            if (activityHandler.onReceive) {
              const localRecipients = await ctx.call('activitypub.activity.getLocalRecipients', { activity });
              for (const recipientUri of localRecipients) {
                ctx.meta.webId = recipientUri;
                ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: recipientUri });
                this.logger.info(`Reception of activity "${key}" by ${recipientUri} detected`);
                await activityHandler.onReceive.bind(this)(ctx, dereferencedActivity, recipientUri);
              }
            }
          }
        }
      }
    },
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients, local } = ctx.params;
      // For local exchanges, we use activitypub.outbox.posted above
      if (!local) {
        for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
          if (activityHandler.onReceive) {
            for (const recipientUri of recipients) {
              ctx.meta.webId = recipientUri;
              ctx.meta.dataset = await ctx.call('auth.account.findDatasetByWebId', { webId: recipientUri });

              // TODO in non-POD config, dereference activity only once ?
              const dereferencedActivity =
                typeof activityHandler.match === 'object'
                  ? await this.matchActivity(ctx, activityHandler.match, activity)
                  : await activityHandler.match.bind(this)(ctx, activity);

              if (dereferencedActivity) {
                this.logger.info(`Reception of activity "${key}" by ${recipientUri} detected`);
                await activityHandler.onReceive.bind(this)(ctx, dereferencedActivity, recipientUri);
              }
            }
          }
        }
      }
    },
  },
};

module.exports = ActivitiesHandlerMixin;
