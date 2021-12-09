const { ACTIVITY_TYPES } = require('../constants');

const ActivitiesHandlerMixin = {
  started() {
    if (!this.schema.activities || this.schema.activities.length === 0) {
      throw new Error('ActivitiesHandlerMixin: no activities defined in the service ' + this.name);
    }
  },
  methods: {
    async matchPattern(pattern, activityOrObject) {
      let dereferencedActivityOrObject = { ...activityOrObject };

      // Check if we need to dereference the activity or object
      if (typeof activityOrObject === 'string') {
        if (pattern.type && Object.values(ACTIVITY_TYPES).includes(pattern.type)) {
          dereferencedActivityOrObject = await this.broker.call('activitypub.activity.get', {
            resourceUri: activityOrObject,
            webId: 'system'
          });
        } else {
          dereferencedActivityOrObject = await this.broker.call('activitypub.object.get', {
            objectUri: activityOrObject,
            actorUri: 'system'
          });
        }
      }

      for (let key of Object.keys(pattern)) {
        if (typeof pattern[key] === 'object') {
          dereferencedActivityOrObject[key] = await this.matchPattern(pattern[key], dereferencedActivityOrObject[key]);
          if (!dereferencedActivityOrObject[key]) return false;
        } else if (Array.isArray(dereferencedActivityOrObject[key])) {
          if (!dereferencedActivityOrObject[key].includes(pattern[key])) return false;
        } else {
          if (pattern[key] !== dereferencedActivityOrObject[key]) return false;
        }
      }

      // We have a match ! Return the dereferenced object
      return dereferencedActivityOrObject;
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitter = activity.actor;
      for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
        if (activityHandler.onEmit) {
          const dereferencedActivity =
            typeof activityHandler.match === 'object'
              ? await this.matchPattern(activityHandler.match, activity)
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
              ? await this.matchPattern(activityHandler.match, activity)
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
