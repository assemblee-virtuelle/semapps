const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: {
      type: 'enum',
      values: ['cacheFirst', 'networkFirst', 'cacheOnly', 'networkOnly', 'staleWhileRevalidate'],
      default: 'cacheFirst'
    }
  },
  async handler(ctx) {
    const { resourceUri, accept, ...rest } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // Without webId, we have no way to know which dataset to look in, so get from network
    const strategy =
      this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system')
        ? 'networkOnly'
        : ctx.params.strategy;

    if (!this.isRemoteUri(resourceUri, webId)) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId})`);
    }

    switch (strategy) {
      case 'cacheFirst':
        return this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx }).catch(e => {
          if (e.code === 404) {
            return this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });
          } else {
            throw e;
          }
        });

      case 'networkFirst':
        return this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx }).catch(e => {
          if (e.code === 404) {
            return this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx });
          } else {
            throw e;
          }
        });

      case 'cacheOnly':
        return this.actions.getStored({ resourceUri, webId, accept, ...rest }, { parentCtx: ctx });

      case 'networkOnly':
        return this.actions.getNetwork({ resourceUri, webId, accept }, { parentCtx: ctx });

      case 'staleWhileRevalidate':
        throw new Error(`Strategy staleWhileRevalidate not implemented yet`);
    }
  }
};
