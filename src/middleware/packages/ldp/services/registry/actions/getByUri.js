const { getContainerFromUri } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true },
    resourceUri: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;

    if (!containerUri && !resourceUri) {
      throw new Error('The param containerUri or resourceUri must be provided to ldp.registry.getByUri');
    }

    let path = new URL(containerUri || getContainerFromUri(resourceUri)).pathname;

    // If we are in a POD provider config, remove the first part with the username
    if( this.settings.podProvider ) {
      path = '/' + path.split('/').slice(2).join('/');
    }

    const containerOptions =
      Object.values(this.registeredContainers).find(container =>
        typeof container === 'string' ? container : container.path === path
      ) || {};

    return { ...this.settings.defaultOptions, ...containerOptions };
  }
};
