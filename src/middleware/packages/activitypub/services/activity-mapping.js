const Handlebars = require('handlebars');
const matchActivity = require('../utils/matchActivity');

const ActivityMappingService = {
  name: 'activity-mapping',
  settings: {
    mappers: [],
    handlebars: {
      helpers: {}
    }
  },
  async started() {
    this.mappers = [];

    for( const [name, fn] of Object.entries(this.settings.handlebars.helpers) ) {
      this.logger.info('Registering handlebars helper ' + name);
      Handlebars.registerHelper(name, fn);
    }

    for (const mapper of this.settings.mappers) {
      await this.actions.addMapper(mapper);
    }
  },
  actions: {
    async map(ctx) {
      const { activity, locale, ...rest } = ctx.params;

      for (const mapper of this.mappers) {
        const dereferencedActivity = await this.matchActivity(mapper.match, activity);

        // If we have a match...
        if (dereferencedActivity) {
          const emitter = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });
          const emitterProfile = emitter.url
            ? await ctx.call('activitypub.actor.getProfile', { actorUri: activity.actor, webId: 'system' })
            : {};
          const templateParams = { activity: dereferencedActivity, emitter, emitterProfile, ...rest };

          return Object.fromEntries(
            Object.entries(mapper.mapping).map(([key, value]) => {
              // If the value is a function, it is a Handlebar template
              if (typeof value === 'function') {
                return [key, value(templateParams)];
              } else {
                // If we have an object with locales mapping, look for the right locale
                if (value[locale]) {
                  return [key, value[locale](templateParams)];
                } else {
                  throw new Error(`No ${locale} locale found for key ${key}`);
                }
              }
            })
          );
        }
      }
    },
    async addMapper(ctx) {
      const { match, mapping, priority = 1 } = ctx.params;

      if( !match || !mapping ) throw new Error('No object defined for match or mapping');

      this.mappers.push({
        match,
        mapping: this.compileObject(mapping),
        priority
      });

      // Reorder cached mappings
      this.prioritizeMappers();
    },
    getMappers() {
      return this.mappers;
    }
  },
  methods: {
    matchActivity(pattern, activityOrObject) {
      return matchActivity(this.broker, pattern, activityOrObject);
    },
    prioritizeMappers() {
      this.mappers.sort((a, b) => b.priority - a.priority);
    },
    compileObject(object) {
      return Object.fromEntries(
        Object.entries(object).map(([key, value]) => {
          if (typeof value === 'string') {
            return [key, Handlebars.compile(value)];
          } else {
            return [key, this.compileObject(value)];
          }
        })
      );
    }
  }
};

module.exports = ActivityMappingService;
