const getRoute = require('./getRoute');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    podProvider: false,
    defaultAccept: 'text/turtle'
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
      let query = ctx.params.query || ctx.params.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
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
