import Handlebars from 'handlebars';
import { ServiceSchema, defineAction } from 'moleculer';
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
    map: defineAction({
      async handler(ctx) {
        let { activity, locale, ...rest } = ctx.params;

        // If the activity is an Announce, match the announced activity
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (this.settings.matchAnnouncedActivities && activity.type === ACTIVITY_TYPES.ANNOUNCE) {
          const announcedActivity =
            // @ts-expect-error TS(2339): Property 'object' does not exist on type 'never'.
            typeof activity.object === 'string'
              ? // @ts-expect-error TS(2339): Property 'object' does not exist on type 'never'.
                await ctx.call('activitypub.object.get', { objectUri: activity.object, actorUri: 'system' })
              : // @ts-expect-error TS(2339): Property 'object' does not exist on type 'never'.
                activity.object;

          // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
          activity = {
            // @ts-expect-error TS(2339): Property 'actor' does not exist on type 'never'.
            actor: activity.actor, // Ensure the actor is defined
            ...announcedActivity
          };
        }

        // @ts-expect-error TS(2488): Type 'string | number | boolean | any[] | Record<a... Remove this comment to see the full error message
        for (const mapper of this.mappers) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const dereferencedActivity = await this.matchActivity(ctx, mapper.match, activity);

          // If we have a match...
          if (dereferencedActivity) {
            // If mapping is false, we want the activity to be ignored
            if (mapper.mapping === false) return;

            // @ts-expect-error TS(2339): Property 'actor' does not exist on type 'never'.
            const emitter = await ctx.call('activitypub.actor.get', { actorUri: activity.actor });

            let emitterProfile = {};
            try {
              emitterProfile = emitter.url
                ? // @ts-expect-error TS(2339): Property 'actor' does not exist on type 'never'.
                  await ctx.call('activitypub.actor.getProfile', { actorUri: activity.actor })
                : {};
            } catch (e) {
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.logger.warn(
                // @ts-expect-error TS(2339): Property 'actor' does not exist on type 'never'.
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
    }),

    addMapper: defineAction({
      async handler(ctx) {
        const { match, mapping, priority = 1 } = ctx.params;

        if (!match || mapping === undefined) throw new Error('No object defined for match or mapping property');

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.mappers.push({
          match,
          // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
          mapping: this.compileObject(mapping),
          priority
        });

        // Reorder cached mappings
        // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
        this.prioritizeMappers();
      }
    }),

    getMappers: defineAction({
      handler() {
        return this.mappers;
      }
    })
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
