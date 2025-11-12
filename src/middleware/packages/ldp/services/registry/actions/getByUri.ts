import { ActionSchema } from 'moleculer';
import { TypeRegistration } from '@semapps/solid';

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

    let typeRegistration: TypeRegistration = await ctx.call('type-index.getByUri', {
      uri: containerUri || resourceUri,
      isContainer: !!containerUri
    });

    // If this a resource, check if its container is registered
    if (!typeRegistration && resourceUri) {
      [containerUri] = await ctx.call('ldp.resource.getContainers', { resourceUri });

      if (containerUri) {
        typeRegistration = await ctx.call('type-index.getByUri', { uri: containerUri, isContainer: true });
      }
    }

    if (typeRegistration) {
      const registration = await this.actions.getByTypes(
        { types: typeRegistration.types, isPrivate: typeRegistration.isPrivate },
        { parentCtx: ctx }
      );

      return { ...this.settings.defaultOptions, ...registration };
    } else {
      return this.settings.defaultOptions;
    }
  }
} satisfies ActionSchema;

export default GetByUriAction;
