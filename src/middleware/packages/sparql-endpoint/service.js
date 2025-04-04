const path = require('path');
const urlJoin = require('url-join');
const getRoute = require('./getRoute');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept: 'text/turtle',
    ignoreAcl: false,
    podProvider: false
  },
  dependencies: ['triplestore', 'api', 'ldp'],
  async started() {
    const basePath = await this.broker.call('ldp.getBasePath');
    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', {
        route: getRoute(path.join(basePath, '/:username([^/.][^/]+)/sparql')),
        toBottom: false
      });
    } else {
      await this.broker.call('api.addRoute', { route: getRoute(path.join(basePath, '/sparql')), toBottom: false });
    }
  },
  actions: {
    async query(ctx) {
      const query = ctx.params.query || ctx.params.body;
      const accept = ctx.params.accept || ctx.meta.headers?.accept || this.settings.defaultAccept;

      if (this.settings.podProvider) {
        const [account] = await ctx.call('auth.account.find', { query: { username: ctx.params.username } });
        if (!account) throw new Error(`No account found with username ${ctx.params.username}`);

        if (account.webId !== ctx.meta.webId && account.webId !== ctx.meta.impersonatedUser) {
          throw new Error(`You can only query your own SPARQL endpoint`);
        }
      }

      const response = await ctx.call('triplestore.query', {
        query,
        accept,
        dataset: this.settings.podProvider ? ctx.params.username : undefined,
        // In Pod provider config, query as system when the Pod owner is querying his own data
        webId: this.settings.ignoreAcl ? 'system' : ctx.meta.webId
      });

      if (ctx.meta.$responseType === undefined) {
        ctx.meta.$responseType = ctx.meta.responseType || accept;
      }

      return response;
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      if (this.settings.podProvider) {
        await ctx.call('activitypub.actor.addEndpoint', {
          actorUri: webId,
          predicate: 'http://rdfs.org/ns/void#sparqlEndpoint',
          endpoint: urlJoin(webId, 'sparql')
        });
      }
    }
  }
};

module.exports = SparqlEndpointService;
