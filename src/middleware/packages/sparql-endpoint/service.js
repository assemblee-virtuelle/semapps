const getRoute = require('./getRoute');
const { Errors: E } = require('moleculer-web');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept: 'text/turtle',
    podProvider: false
  },
  dependencies: ['triplestore', 'api'],
  async started() {
    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', { route: getRoute('/:username/sparql') });
    } else {
      await this.broker.call('api.addRoute', { route: getRoute('/sparql') });
    }
  },
  actions: {
    async query(ctx) {
      const query = ctx.params.query || ctx.params.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;

      // Only user can query his own pod
      if( this.settings.podProvider ) {
        const account = await ctx.call('auth.account.findByWebId', { webId: ctx.meta.webId });
        if( account.username !== ctx.params.username ) throw new E.ForbiddenError();
      }

      const response = await ctx.call('triplestore.query', {
        query,
        accept,
        dataset: ctx.params.username
      });
      if (ctx.meta.$responseType === undefined) {
        ctx.meta.$responseType = ctx.meta.responseType || accept;
      }
      return response;
    }
  }
};

module.exports = SparqlEndpointService;
