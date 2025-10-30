import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';

/**
 * Find the registration for a resource type
 */
const GetByTypesAction = {
  visibility: 'public',
  params: {
    types: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] }
  },
  async handler(ctx) {
    const { types } = ctx.params;
    const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types });

    return this.registrations.find(r => expandedTypes.some((t: any) => arrayOf(r.acceptedTypes).includes(t)));
  }
} satisfies ActionSchema;

export default GetByTypesAction;
