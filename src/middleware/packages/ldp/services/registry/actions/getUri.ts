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
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { type, isContainer, typeIndex, webId } = ctx.params;

    const [uri] = (await ctx.call('type-index.getUris', {
      type,
      isContainer,
      isPrivate: typeIndex === 'private',
      webId
    })) as string[];

    return uri;
  }
} satisfies ActionSchema;

export default GetUriAction;
