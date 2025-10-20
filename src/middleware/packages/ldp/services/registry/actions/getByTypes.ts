import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';
import { ContainerOptions } from '../../../types.ts';

/**
 * Find the container options for a resource type
 */
const Schema = {
  visibility: 'public',
  params: {
    types: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] }
  },
  // cache: true,
  async handler(ctx) {
    const { types } = ctx.params;
    const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types });

    return Object.values(this.registeredContainers).find(container =>
      expandedTypes.some((t: any) => arrayOf(container.acceptedTypes).includes(t))
    );
  }
} satisfies ActionSchema;

export default Schema;
