'use strict';
const getRoute = require('./getRoute');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept: 'text/turtle'
  },
  dependencies: ['triplestore', 'api'],
  async started() {
    await this.broker.call('api.addRoute', {
      route: getRoute()
    });
  },
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.params.body;
      const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
      const response = await ctx.call('triplestore.query', {
        query: query,
        accept: accept
      });
      if (ctx.meta.$responseType === undefined) {
        ctx.meta.$responseType = ctx.meta.responseType || accept;
      }
      return response;
    }
  }
};

module.exports = SparqlEndpointService;
