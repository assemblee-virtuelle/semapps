import { ActionSchema } from 'moleculer';
import { arrayOf } from '../../../utils.ts';
import { Registration } from '../../../types.ts';

/**
 * Find the registration for a resource type
 */
const GetByTypesAction = {
  visibility: 'public',
  params: {
    types: { type: 'multi', rules: [{ type: 'string' }, { type: 'array' }] },
    isPrivate: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    const { types, isPrivate } = ctx.params;
    const expandedTypes: string[] = await ctx.call('jsonld.parser.expandTypes', { types });

    return this.registrations.find(
      (r: Registration) =>
        expandedTypes.some(t => arrayOf(r.types).includes(t)) &&
        (isPrivate === undefined || r.typeIndex === (isPrivate ? 'private' : 'public'))
    );
  }
} satisfies ActionSchema;

export default GetByTypesAction;
