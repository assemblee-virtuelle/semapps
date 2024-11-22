const { MIME_TYPES } = require('@semapps/mime-types');
const { cleanUndefined } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', default: MIME_TYPES.JSON },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    // Inspired from https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
    strategy: {
      type: 'enum',
      values: ['cacheFirst', 'networkFirst', 'cacheOnly', 'networkOnly', 'staleWhileRevalidate'],
      default: 'cacheFirst'
    }
  },
  async handler(ctx) {
    const { resourceUri, accept, jsonContext, ...rest } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    // Without webId, we have no way to know which dataset to look in, so get from network
    const strategy =
      this.settings.podProvider && (!webId || webId === 'anon' || webId === 'system')
        ? 'networkOnly'
        : ctx.params.strategy;

    if (!(await this.actions.isRemote(resourceUri, { parentCtx: ctx }))) {
      throw new Error(
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    switch (strategy) {
      case 'cacheFirst':
        return this.actions
          .getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), { parentCtx: ctx })
          .catch(e => {
            if (e.code === 404) {
              return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), {
                parentCtx: ctx
              });
            } else {
              throw e;
            }
          });

      case 'networkFirst':
        return this.actions
          .getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx })
          .catch(e => {
            if (e.code === 404) {
              return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
                parentCtx: ctx
              });
            } else {
              throw e;
            }
          });

      case 'cacheOnly':
        return this.actions.getStored(cleanUndefined({ resourceUri, webId, accept, jsonContext, ...rest }), {
          parentCtx: ctx
        });

      case 'networkOnly':
        return this.actions.getNetwork(cleanUndefined({ resourceUri, webId, accept, jsonContext }), { parentCtx: ctx });

      case 'staleWhileRevalidate':
        // Not implemented yet
        break;

      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
};
