import { defineAction } from 'moleculer';

/**
 * Find the container options for a resource type
 * This only returns containers registered with the LDP registry, not the ones registered with the TypeIndex.
 */
const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
    type: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] }
  },
  async handler(ctx) {
    const { type } = ctx.params;
    const types = await ctx.call('jsonld.parser.expandTypes', { types: type });
    const registeredContainers = await this.actions.list({}, { parentCtx: ctx });

    return Object.values(registeredContainers).find(container =>
      types.some((t: any) =>
        // @ts-expect-error TS(18046): 'container' is of type 'unknown'.
        Array.isArray(container.acceptedTypes) ? container.acceptedTypes.includes(t) : container.acceptedTypes === t
      )
    );
  }
});

export default Schema;
