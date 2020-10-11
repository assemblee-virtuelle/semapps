'use strict';
const getRoutes = require('./getRoutes');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept: 'text/turtle'
  },
  dependencies: ['triplestore'],
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.params.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
      console.log('XXXXXXXXXXXXXXXXX SparqlEndpointService');
      const response = await ctx.call('triplestore.query', {
        query: query,
        accept: accept
      });
      if (ctx.meta.$responseType === undefined) {
        ctx.meta.$responseType = accept;
      }
      return response;
    },
    getApiRoutes() {
      return getRoutes();
    }
  }
};

module.exports = SparqlEndpointService;
