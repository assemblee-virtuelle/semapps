'use strict';

const fetch = require('node-fetch');

module.exports = {
  name: 'ldp',
  settings: {
    sparqlEndpoint: null,
    mainDataset: null
  },
  routes: {
    path: '/',
    aliases: {
      'GET activities': 'ldp.list'
    }
  },
  dependencies: ['triplestore'],
  actions: {
    async list(ctx) {
      ctx.meta.$responseType = 'text/turtle';
      let result = await this.getTriples(`
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
            `);
      return result;
    }
  },
  methods: {
    async getTriples(query) {
      let response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/query', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/sparql-query'
        }
      });
      return response.text();
    }
  }
};
