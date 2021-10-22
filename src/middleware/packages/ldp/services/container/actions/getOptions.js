const { getContainerFromUri } = require('../../../utils');

// TODO refactor as this won't work anymore with pods
module.exports = {
  visibility: 'public',
  params: {
    uri: { type: 'string' }
  },
  async handler(ctx) {
    const { uri } = ctx.params;

    console.log('get container options', uri, ctx.$params);

    return this.settings.defaultOptions;

    // const containerOptions =
    //   // Try to find a matching container
    //   this.settings.containers.find(container => this.getContainerUri(container) === uri) ||
    //   // If no container was found, assume the URI passed is a resource
    //   this.settings.containers.find(container => this.getContainerUri(container) === getContainerFromUri(uri)) ||
    //   {};
    //
    // return { ...this.settings.defaultOptions, ...containerOptions };
  }
};
