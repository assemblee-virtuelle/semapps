'use strict';

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
    }
  }
};

module.exports = SparqlEndpointService;
