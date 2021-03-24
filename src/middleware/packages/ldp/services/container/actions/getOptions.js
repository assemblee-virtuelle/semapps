const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    uri: { type: 'string' }
  },
  cache: true,
  async handler(ctx) {
    const { uri } = ctx.params;
    const options =
      this.settings.containers.find(
        container => typeof container !== 'string' && uri.startsWith(urlJoin(this.settings.baseUrl, container.path))
      ) || {};
    return { ...this.settings.defaultOptions, ...options };
  }
};
