const { MoleculerError } = require('moleculer').Errors;

const ProxyService = {
  name: 'activitypub.proxy',
  settings: {
    podProvider: false
  },
  dependencies: ['api'],
  async started() {
    const routeConfig = {
      authorization: true,
      authentication: false,
      mergeParams: true,
      aliases: {
        'POST /': 'activitypub.proxy.api_query',
      },
      bodyParsers: {
        json: true,
        urlencoded: true
      }
    };

    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', { route: { path: '/:username/proxy', ...routeConfig }, toBottom: false });
    } else {
      await this.broker.call('api.addRoute', { route: { path: '/proxy', ...routeConfig }, toBottom: false });
    }
  },
  actions: {
    async api_query(ctx) {
      const resourceUri = ctx.params.id;
      const actorUri = ctx.meta.webId;

      // Only user can query his own proxy URL
      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        if (account.username !== ctx.params.username) throw new E.ForbiddenError();
      }

      try {
        return await ctx.call('activitypub.proxy.query', {
          resourceUri,
          actorUri
        })
      } catch(e) {
        console.error(e);
        ctx.meta.$statusCode = e.code || 500;
        ctx.meta.$statusMessage = e.message;
      }
    },
    async query(ctx) {
      const { resourceUri, actorUri } = ctx.params;

      const signatureHeaders = await ctx.call('signature.generateSignatureHeaders', {
        url: resourceUri,
        method: 'GET',
        actorUri
      });

      const response = await fetch(resourceUri, {
        headers: {
          Accept: 'application/json',
          ...signatureHeaders
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new MoleculerError(response.statusText, response.status);
      }
    }
  }
};

module.exports = ProxyService;
