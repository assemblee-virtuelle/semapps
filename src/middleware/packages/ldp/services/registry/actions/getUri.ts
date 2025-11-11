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
    isPrivate: { type: 'boolean', optional: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { type, isContainer, isPrivate } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId;

    const [uri] = (await ctx.call('type-index.getUris', { type, isContainer, isPrivate, webId })) as string[];

    return uri;
  }
} satisfies ActionSchema;

export default GetUriAction;
