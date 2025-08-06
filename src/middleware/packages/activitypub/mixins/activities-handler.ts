import { ServiceSchema, defineAction } from 'moleculer';

const ActivitiesHandlerMixin = {
  dependencies: ['activitypub.side-effects'],
  async started() {
    if (!this.schema.activities || this.schema.activities.length === 0) {
      throw new Error(`ActivitiesHandlerMixin: no activities defined in the service ${this.name}`);
    }

    for (const [key, activityHandler] of Object.entries(this.schema.activities)) {
      const boxTypes = [];
      // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
      if (activityHandler.onReceive) boxTypes.push('inbox');
      // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
      if (activityHandler.onEmit) boxTypes.push('outbox');

      await this.broker.call('activitypub.side-effects.addProcessor', {
        // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
        matcher: typeof activityHandler.match === 'function' ? activityHandler.match.bind(this) : activityHandler.match,
        capabilityGrantMatchFnGenerator:
          // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
          typeof activityHandler.capabilityGrantMatchFnGenerator === 'function'
            ? // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
              activityHandler.capabilityGrantMatchFnGenerator.bind(this)
            : undefined,
        actionName: `${this.name}.processActivity`,
        boxTypes,
        key,
        // @ts-expect-error TS(18046): 'activityHandler' is of type 'unknown'.
        priority: activityHandler.priority
      });
    }
  },
  actions: {
    processActivity: defineAction({
      async handler(ctx) {
        const { key, boxType, dereferencedActivity, actorUri } = ctx.params;

        const activityHandler = this.schema.activities[key];

        if (!activityHandler) {
          this.logger.warn(`Cannot process activity because no handler with key ${key} found`);
          return dereferencedActivity;
        }

        if (boxType === 'inbox' && activityHandler.onReceive) {
          return await activityHandler.onReceive.bind(this)(ctx, dereferencedActivity, actorUri);
        } else if (boxType === 'outbox' && activityHandler.onEmit) {
          return await activityHandler.onEmit.bind(this)(ctx, dereferencedActivity, actorUri);
        } else {
          this.logger.warn(
            `Cannot process activity because no onReceive or onEmit methods are associated with with key ${key}`
          );
          return dereferencedActivity;
        }
      }
    })
  }
} satisfies Partial<ServiceSchema>;

export default ActivitiesHandlerMixin;
