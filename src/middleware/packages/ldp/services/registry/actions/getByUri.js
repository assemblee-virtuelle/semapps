module.exports = {
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
      const path = new URL(containerUri).pathname;
      const containerOptions = Object.values(this.registeredContainers).find(container => container.pathRegex.test(path)) || {};
      return { ...this.settings.defaultOptions, ...containerOptions };
    } else {
      return this.settings.defaultOptions;
    }
  }
};
