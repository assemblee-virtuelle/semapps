const { ACTIVITY_TYPES } = require('../constants');

const ActivitiesHandlerMixin = {
  started() {
    if( !this.schema.activities || this.schema.activities.length === 0 ) {
      throw new Error('ActivitiesHandlerMixin: no activities defined in the service ' + this.name)
    }
  },
  methods: {
    async matchPattern(pattern, activityOrObject) {
      // Check if we need to dereference the activity or object
      if( typeof activityOrObject === 'string' ) {
        if( pattern.type && Object.values(ACTIVITY_TYPES).includes(pattern.type) ) {
          activityOrObject = await this.broker.call('activitypub.activity.get', { resourceUri: activityOrObject, webId: 'system' });
        } else {
          activityOrObject = await this.broker.call('activitypub.object.get', { objectUri: activityOrObject, actorUri: 'system' });
        }
      }

      for( let key of Object.keys(pattern) ) {
        if (typeof pattern[key] === 'object') {
          activityOrObject[key] = await this.matchPattern(pattern[key], activityOrObject[key]);
          if (!activityOrObject[key]) return false;
        } else if ( Array.isArray(activityOrObject[key]) ) {
          if( !activityOrObject[key].includes(pattern[key]) ) return false;
        } else {
          if( pattern[key] !== activityOrObject[key] ) return false;
        }
      }

      // We have a match ! Return the dereferenced object
      return activityOrObject;
    }
  },
  events: {
    async 'activitypub.outbox.posted'(ctx) {
      const { activity } = ctx.params;
      const emitter = activity.actor;
      const handlersWithEmit = this.schema.activities.filter(a => a.onEmit);
      for( let activityHandler of handlersWithEmit ) {
        const dereferencedActivity = typeof activityHandler.match === 'object'
          ? await this.matchPattern(activityHandler.match, activity)
          : await activityHandler.match(activity);

        if( dereferencedActivity ) {
          await activityHandler.onEmit(ctx, dereferencedActivity, emitter);
        }
      }
    },
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients } = ctx.params;
      const handlersWithReceive = this.schema.activities.filter(a => a.onReceive);
      for( let activityHandler of handlersWithReceive ) {
        const dereferencedActivity = typeof activityHandler.match === 'object'
          ? await this.matchPattern(activityHandler.match, activity)
          : await activityHandler.match(activity);

        if( dereferencedActivity ) {
          await activityHandler.onReceive(ctx, dereferencedActivity, recipients);
        }
      }
    }
  }
}

module.exports = ActivitiesHandlerMixin;
