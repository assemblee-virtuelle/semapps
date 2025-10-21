import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';

/**
 * Find the container options for a resource type
 */
const GetByTypesAction = {
  visibility: 'public',
  params: {
    types: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] }
  },
  async handler(ctx) {
    const { types } = ctx.params;
    const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types });

    return Object.values(this.registrations).find(registration =>
      expandedTypes.some((t: any) => arrayOf(registration.acceptedTypes).includes(t))
    );
  }
} satisfies ActionSchema;

export default GetByTypesAction;
