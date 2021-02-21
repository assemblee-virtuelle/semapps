'use strict';
const getRoute = require('./getRoute');

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    defaultAccept: 'text/turtle'
  },
  dependencies: ['triplestore', 'api'],
  async started () {
    console.log("starting sparql-endpoint service");
    await this.broker.call('api.addRoute', {
      route: getRoute()
    });
    console.log("routes added for sparql-endpoint service");
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
        ctx.meta.$responseType = accept;
      }
      return response;
    },
  }
};

module.exports = SparqlEndpointService;
