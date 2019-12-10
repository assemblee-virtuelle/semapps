'use strict';

const fetch = require('node-fetch');

module.exports = {
  name: 'ldp',
  settings: {
    sparqlEndpoint: null,
    mainDataset: null,
    homeUrl: null
  },
  routes: {
    path: '/',
    aliases: {
      'GET view/activities': 'ldp.activities',
      'GET type/:container': 'ldp.type',
      'GET subject/:identifier': 'ldp.subject'
    }
  },
  dependencies: ['triplestore'],
  actions: {
    async activities(ctx) {
      ctx.meta.$responseType = 'text/turtle';
      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
          	?activity rdf:type as:Create.
          	?activity as:object ?object.
          	?object rdf:type ?typeObject.
          	?object as:content ?content.
          	?object as:name ?name.
          	?object as:published ?published.
          }
          WHERE {
          	?activity rdf:type as:Create ;
          	as:object ?object.
          	?object rdf:type ?typeObject;
          	as:content ?content;
          	as:name ?name;
          	as:published ?published.
          }
              `,
        accept: 'turtle'
      });

      return result;
    },
    async type(ctx) {
      ctx.meta.$responseType = 'text/turtle';

      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
          	?suject ?predicate ?object.
          }
          WHERE {
          	?suject rdf:type ${ctx.params.container} ;
            	?predicate ?object.
          }
              `,
        accept: 'turtle'
      });

      return result;
    },
    async subject(ctx) {
      ctx.meta.$responseType = 'text/turtle';

      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${this.settings.homeUrl}subject/${ctx.params.identifier}> ?predicate ?object.
          }
          WHERE {
            <${this.settings.homeUrl}subject/${ctx.params.identifier}> ?predicate ?object.
          }
              `,
        accept: 'turtle'
      });

      return result;
    }
  }
};
