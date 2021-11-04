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
        'POST /': 'activitypub.proxy.query',
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
    async query(ctx) {
      const resourceUri = ctx.params.id;
      const actorUri = ctx.meta.webId;

      // Only user can query his own proxy URL
      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        if (account[0].username !== ctx.params.username) throw new E.ForbiddenError();
      }

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
        ctx.meta.$statusCode = response.status;
        ctx.meta.$statusMessage = response.statusText;
      }
    }
  }
};

module.exports = ProxyService;
