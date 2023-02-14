const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: { type: 'enum', values: ['cacheOnly', 'networkOnly', 'cacheFirst', 'networkFirst', 'staleWhileRevalidate'], default: 'cacheFirst' }
  },
  async handler(ctx) {
    const { resourceUri, strategy, accept, ...rest } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!this.isRemoteUri(resourceUri)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    if (strategy === 'cacheFirst') {
      try {
        return this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx });
      } catch (e) {
        if (e.code === 404) {
          return this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });
        } else {
          console.error(e);
          throw e;
        }
      }
    } else {
      throw new Error(`Strategy ${strategy} not implemented yet`);
    }
  }
};

