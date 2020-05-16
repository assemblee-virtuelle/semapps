'use strict';
const getRoutes = require('./getRoutes');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept:'text/turtle'
  },
  dependencies: ['triplestore'],
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.meta.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept
      ctx.meta.$responseType = accept;
      return await ctx.call('triplestore.query', {
        query: query,
        accept: accept
      });
    },
    getApiRoutes() {
      return getRoutes();;
    }
  }

};

module.exports = SparqlEndpointService;
