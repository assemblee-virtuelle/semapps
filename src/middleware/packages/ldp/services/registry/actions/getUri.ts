import { ActionSchema } from 'moleculer';

/**
 * Get the container URI based on its type
 * Short cut to the TypeIndexService
 */
const GetUriAction = {
  visibility: 'public',
  params: {
    type: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { type, webId } = ctx.params;

    const containersUris = await ctx.call('type-index.getContainersUris', { type, webId });

    return containersUris?.[0];
  }
} satisfies ActionSchema;

export default GetUriAction;
