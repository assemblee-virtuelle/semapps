import { ActionSchema } from 'moleculer';
import { getWebIdFromUri } from '../../../utils.ts';

/**
 * Find the registration for a container or resource URI
 */
const GetByUriAction = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true },
    resourceUri: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, resourceUri } = ctx.params;

    if (!containerUri && !resourceUri) {
      throw new Error('The param containerUri or resourceUri must be provided to ldp.registry.getByUri');
    }

    let types: string[] = await ctx.call('type-index.getTypes', {
      uri: containerUri || resourceUri,
      webId: getWebIdFromUri(containerUri || resourceUri)
    });

    // If this a resource, check if its container is registered
    if (types.length === 0 && resourceUri) {
      [containerUri] = await ctx.call('ldp.resource.getContainers', { resourceUri });

      if (containerUri) {
        types = await ctx.call('type-index.getTypes', {
          uri: containerUri,
          isContainer: true,
          webId: getWebIdFromUri(containerUri)
        });
      }
    }

    if (types) {
      const registration = await this.actions.getByTypes({ types }, { parentCtx: ctx });

      return { ...this.settings.defaultOptions, ...registration };
    } else {
      return this.settings.defaultOptions;
    }
  }
} satisfies ActionSchema;

export default GetByUriAction;
