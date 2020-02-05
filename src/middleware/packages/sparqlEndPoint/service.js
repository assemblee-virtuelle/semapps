'use strict';

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {},
  dependencies: ['triplestore'],
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.meta.body;
      ctx.meta.$responseType = ctx.params.accept || ctx.meta.headers.accept;
      let result = await ctx.call('triplestore.query', {
        query: `
          ${query}
              `,
        accept: this.getAcceptHeader(ctx.params.accept || ctx.meta.headers.accept)
      });

      return result;
    }
  },
  methods: {
    getAcceptHeader(accept) {
      switch (accept) {
        case 'text/turtle':
          return 'turtle';
        case 'application/n-triples':
          return 'triple';
        case 'application/ld+json':
          return 'json';
        default:
          throw new Error('Unknown accept parameter: ' + accept);
      }
    }
  }
};

module.exports = SparqlEndpointService;
