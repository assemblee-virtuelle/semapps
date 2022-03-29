const { compile } = require("handlebars");
const matchActivity = require('../utils/matchActivity');

const ActivityMappingService = {
  name: 'activity-mapping',
  settings: {
    mappers: []
  },
  async started() {
    this.mappers = [];
    for( const mapper of this.settings.mappers ) {
      await this.actions.addMapper(mapper);
    }
  },
  actions: {
    async map(ctx) {
      const { activity, locale, ...rest } = ctx.params;

      for( const mapper of this.mappers ) {
        const dereferencedActivity = await matchActivity(ctx, mapper.match, activity);

        // If we have a match...
        if( dereferencedActivity ) {
          const emitter = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });

          return Object.fromEntries(Object.entries(mapper.mapping).map(([key, value]) => {
            // If the value is a function, it is a Handlebar template
            if( typeof value === 'function' ) {
              return [key, value({ activity: dereferencedActivity, emitter, ...rest })];
            } else {
              // If we have an object with locales mapping, look for the right locale
              if( value[locale] ) {
                return [key, value[locale]({ activity: dereferencedActivity, emitter, ...rest })];
              } else {
                throw new Error(`No ${locale} locale found for key ${key}`);
              }
            }
          }));
        }
      }
    },
    async addMapper(ctx) {
      const { match, mapping, priority = 1 } = ctx.params;

      this.mappers.push({
        match,
        mapping: this.compileObject(mapping),
        priority
      });

      // Reorder cached mappings
      this.prioritizeMappers();
    }
  },
  methods: {
    prioritizeMappers() {
      this.mappers.sort((a, b) => a.priority - b.priority);
    },
    compileObject(object) {
      return Object.fromEntries(Object.entries(object).map(([key, value]) => {
        if( typeof value === 'string' ) {
          return [key, compile(value)];
        } else {
          return [key, this.compileObject(value)];
        }
      }));
    }
  }
};

module.exports = ActivityMappingService;
