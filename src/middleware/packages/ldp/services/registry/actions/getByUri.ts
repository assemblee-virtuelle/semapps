import { ActionSchema } from 'moleculer';

/**
 * Find the container options for a container URI
 */
const Schema = {
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

    if (!containerUri) {
      const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
      containerUri = containers[0];
    }

    if (containerUri) {
      const basePath = await ctx.call('ldp.getBasePath');
      const path = new URL(containerUri).pathname.replace(basePath, '/');
      const registeredContainers = await this.actions.list({}, { parentCtx: ctx });
      const containerOptions =
        // @ts-expect-error TS(18046): 'container' is of type 'unknown'.
        Object.values(registeredContainers).find(container => container.pathRegex.test(path)) || {};
      return { ...this.settings.defaultOptions, ...containerOptions };
    }
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    return this.settings.defaultOptions;
  }
} satisfies ActionSchema;

export default Schema;
