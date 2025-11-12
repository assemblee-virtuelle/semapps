import { TypeRegistration } from '@semapps/solid';
import { ActionSchema } from 'moleculer';

/**
 * Get the container or resource URI based on its type
 * Shortcut to the TypeIndexService
 */
const GetUriAction = {
  visibility: 'public',
  params: {
    type: { type: 'string' },
    isContainer: { type: 'boolean', default: true },
    isPrivate: { type: 'boolean', optional: true }
  },
  async handler(ctx) {
    const { type, isContainer, isPrivate } = ctx.params;

    const typeRegistration: TypeRegistration = await ctx.call('type-index.getByType', {
      type,
      isContainer,
      isPrivate
    });

    return typeRegistration?.uri;
  }
} satisfies ActionSchema;

export default GetUriAction;
