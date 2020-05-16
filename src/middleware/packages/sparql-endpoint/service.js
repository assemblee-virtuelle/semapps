'use strict';
const getRoutes = require('./getRoutes');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {},
  dependencies: ['triplestore'],
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.meta.body;
      ctx.meta.$responseType = ctx.params.accept || ctx.meta.headers.accept;
      return await ctx.call('triplestore.query', {
        query: query,
        accept: ctx.params.accept || ctx.meta.headers.accept
      });
    },
    getApiRoutes() {
      return getRoutes();;
    }
  }

};

module.exports = SparqlEndpointService;
