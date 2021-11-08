const { pathToRegexp } = require('path-to-regexp');
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
      throw new Error('The param containerUri or resourceUri must be provided to ldp.container.getOptions');
    }

    const path = new URL(containerUri || getContainerFromUri(resourceUri)).pathname;

    const containerOptions =
      Object.values(this.registeredContainers).find(container =>
        pathToRegexp(typeof container === 'string' ? container : container.path).test(path)
      ) || {};

    return { ...this.settings.defaultOptions, ...containerOptions };
  }
};
