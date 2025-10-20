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
  // cache: true,
  async handler(ctx) {
    let { containerUri, resourceUri } = ctx.params;

    if (!containerUri && !resourceUri) {
      throw new Error('The param containerUri or resourceUri must be provided to ldp.registry.getByUri');
    }

    if (!containerUri) {
      const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
      containerUri = containers[0];
    }

    if (containerUri) {
      const types = await ctx.call('type-index.getTypes', {
        containerUri,
        webId: this.settings.podProvider ? getWebIdFromUri(containerUri) : undefined
      });

      const containerOptions = await this.actions.getByTypes({ types }, { parentCtx: ctx });

      return { ...this.settings.defaultOptions, ...containerOptions };
    } else {
      return this.settings.defaultOptions;
    }
  }
} satisfies ActionSchema;

export default GetByUriAction;
