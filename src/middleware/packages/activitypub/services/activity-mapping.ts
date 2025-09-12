import Handlebars from 'handlebars';
import { ServiceSchema } from 'moleculer';
import matchActivity from '../utils/matchActivity.ts';
import { ACTIVITY_TYPES } from '../constants.ts';

const ActivityMappingService = {
  name: 'activity-mapping' as const,
  settings: {
    mappers: [],
    handlebars: {
      helpers: {}
    },
    matchAnnouncedActivities: false
  },
  async started() {
    this.mappers = [];

    for (const [name, fn] of Object.entries(this.settings.handlebars.helpers)) {
      this.logger.info(`Registering handlebars helper ${name}`);
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      Handlebars.registerHelper(name, fn);
    }

    for (const mapper of this.settings.mappers) {
      await this.actions.addMapper(mapper);
    }
  },
  actions: {
    map: {
      async handler(ctx) {
        let { activity, locale, ...rest } = ctx.params;

        // If the activity is an Announce, match the announced activity
        if (this.settings.matchAnnouncedActivities && activity.type === ACTIVITY_TYPES.ANNOUNCE) {
          const announcedActivity =
            typeof activity.object === 'string'
              ? await ctx.call('activitypub.object.get', { objectUri: activity.object, actorUri: 'system' })
              : activity.object;

          activity = {
            actor: activity.actor, // Ensure the actor is defined
            ...announcedActivity
          };
        }

        for (const mapper of this.mappers) {
          const dereferencedActivity = await this.matchActivity(ctx, mapper.match, activity);

          // If we have a match...
          if (dereferencedActivity) {
            // If mapping is false, we want the activity to be ignored
            if (mapper.mapping === false) return;

            const emitter = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });

            let emitterProfile = {};
            try {
              emitterProfile = emitter.url
                ? await ctx.call('activitypub.actor.getProfile', { actorUri: activity.actor })
                : {};
            } catch (e) {
              this.logger.warn(
                `Could not get profile of actor ${activity.actor} (webId ${ctx.meta.webId} / dataset ${ctx.meta.dataset})`
              );
            }

            const templateParams = { activity: dereferencedActivity, emitter, emitterProfile, ...rest };

            return Object.fromEntries(
              Object.entries(mapper.mapping).map(([key, value]) => {
                // If the value is a function, it is a Handlebar template
                if (typeof value === 'function') {
                  return [key, value(templateParams)];
                }
                // If we have an object with locales mapping, look for the right locale
                // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
                if (value[locale]) {
                  // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
                  return [key, value[locale](templateParams)];
                }
                throw new Error(`No ${locale} locale found for key ${key}`);
              })
            );
          }
        }
      }
    },

    addMapper: {
      async handler(ctx) {
        const { match, mapping, priority = 1 } = ctx.params;

        if (!match || mapping === undefined) throw new Error('No object defined for match or mapping property');

        this.mappers.push({
          match,
          mapping: this.compileObject(mapping),
          priority
        });

        // Reorder cached mappings
        this.prioritizeMappers();
      }
    },

    getMappers: {
      handler() {
        return this.mappers;
      }
    }
  },
  methods: {
    matchActivity(ctx, pattern, activityOrObject) {
      return matchActivity(ctx, pattern, activityOrObject);
    },
    prioritizeMappers() {
      this.mappers.sort((a: any, b: any) => b.priority - a.priority);
    },
    compileObject(object) {
      return (
        object &&
        Object.fromEntries(
          Object.entries(object).map(([key, value]) => {
            if (typeof value === 'string') {
              return [key, Handlebars.compile(value)];
            }
            return [key, this.compileObject(value)];
          })
        )
      );
    }
  }
} satisfies ServiceSchema;

export default ActivityMappingService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ActivityMappingService.name]: typeof ActivityMappingService;
    }
  }
}
