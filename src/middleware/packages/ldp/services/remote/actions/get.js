const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: { type: 'enum', values: ['cacheFirst', 'networkFirst', 'cacheOnly', 'networkOnly', 'staleWhileRevalidate'], default: 'cacheFirst' }
  },
  async handler(ctx) {
    const { resourceUri, strategy, accept, ...rest } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    switch(strategy) {
      case 'cacheFirst':
        return this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx })
          .catch(e => {
            if (e.code === 404) {
              return this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });
            } else {
              throw e;
            }
          });

      case 'networkFirst':
        try {
          const resource = await this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });
          return resource;
        } catch (e) {
          if (e.code === 404) {
            return await this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx });
          } else {
            throw e;
          }
        }

      case 'cacheOnly':
        return await this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx });

      case 'networkOnly':
        return await this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });

      case 'staleWhileRevalidate':
        throw new Error(`Strategy staleWhileRevalidate not implemented yet`);
    }
  }
};

