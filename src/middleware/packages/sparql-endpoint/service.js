const getRoutes = require('./getRoutes');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    podProvider: false,
    defaultAccept: 'text/turtle',
  },
  dependencies: ['triplestore', 'api', 'auth.account'],
  async started() {
    let datasetsMapping;

    if( this.settings.podProvider ) {
      // TODO use /:username instead of adding one SPARQL route per user
      const accounts = await this.broker.call('auth.account.find');
      datasetsMapping = Object.fromEntries(accounts.map(account => ['/' + account.username + '/sparql', account.username]));
    } else {
      // null = use default dataset
      datasetsMapping['/sparql'] = null;
    }

    for (let route of getRoutes(datasetsMapping)) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.params.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
      const response = await ctx.call('triplestore.query', {
        query,
        accept
      });
      if (ctx.meta.$responseType === undefined) {
        ctx.meta.$responseType = ctx.meta.responseType || accept;
      }
      return response;
    }
  }
};

module.exports = SparqlEndpointService;
