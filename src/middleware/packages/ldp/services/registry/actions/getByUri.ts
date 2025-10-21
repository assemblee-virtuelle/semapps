import { ActionSchema } from 'moleculer';
import { getWebIdFromUri } from '../../../utils.ts';

/**
 * Find the container options for a container or resource URI
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

    let types = await ctx.call('type-index.getTypes', {
      uri: containerUri || resourceUri,
      webId: this.settings.podProvider ? getWebIdFromUri(containerUri) : undefined
    });

    // If this a resource, check if its container is registered
    if (!types && resourceUri) {
      [containerUri] = await ctx.call('ldp.resource.getContainers', { resourceUri });

      if (containerUri) {
        types = await ctx.call('type-index.getTypes', {
          uri: containerUri,
          isContainer: true,
          webId: this.settings.podProvider ? getWebIdFromUri(containerUri) : undefined
        });
      }
    }

    if (types) {
      const containerOptions = await this.actions.getByTypes({ types }, { parentCtx: ctx });

      return { ...this.settings.defaultOptions, ...containerOptions };
    } else {
      return this.settings.defaultOptions;
    }
  }
} satisfies ActionSchema;

export default GetByUriAction;
