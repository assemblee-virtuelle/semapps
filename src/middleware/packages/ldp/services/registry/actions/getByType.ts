import { ActionSchema } from 'moleculer';

/**
 * Find the container options for a resource type
 * This only returns containers registered with the LDP registry, not the ones registered with the TypeIndex.
 */
const Schema = {
  visibility: 'public',
  params: {
    type: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] }
  },
  async handler(ctx) {
    const { type } = ctx.params;
    const types = await ctx.call('jsonld.parser.expandTypes', { types: type });
    const registeredContainers = await this.actions.list({}, { parentCtx: ctx });

    return Object.values(registeredContainers).find(container =>
      types.some(t =>
        Array.isArray(container.acceptedTypes) ? container.acceptedTypes.includes(t) : container.acceptedTypes === t
      )
    );
  }
} satisfies ActionSchema;

export default Schema;
