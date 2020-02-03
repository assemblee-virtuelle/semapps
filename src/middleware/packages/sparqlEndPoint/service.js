'use strict';

const SparqlEndpointService = {
  name: 'sparqlEndpoint',
  settings: {
    ontologies: []
  },
  dependencies: ['triplestore'],
  actions: {
    async query(ctx) {
      let query = ctx.params.query || ctx.meta.body;
      ctx.meta.$responseType = ctx.params.accept || ctx.meta.headers.accept;
      let result = await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          ${query}
              `,
        accept: this.getAcceptHeader(ctx.params.accept || ctx.meta.headers.accept)
      });

      return result;
    }
  },
  methods: {
    getPrefixRdf() {
      return this.settings.ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
    },
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
    },
  }
};

module.exports = SparqlEndpointService;
