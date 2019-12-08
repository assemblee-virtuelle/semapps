'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');

module.exports = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    sparqlHeaders: {}
  },
  actions: {
    async insert({ params }) {
      // Transforms JSONLD to RDF
      const rdf = await jsonld.toRDF(params.resource, { format: 'application/n-quads' });

      return await fetch(this.settings.sparqlEndpoint + 'update', {
        method: 'POST',
        body: `INSERT DATA { ${rdf} }`,
        headers: {
          'Content-Type': 'application/sparql-update',
          ...this.settings.sparqlHeaders
        }
      });
    },
    async query({ params }) {
      const result = await fetch(this.settings.sparqlEndpoint + 'query', {
        method: 'POST',
        body: params.query,
        headers: {
          'Content-Type': 'application/sparql-query',
          ...this.settings.sparqlHeaders
        }
      });

      const jsonResult = await result.json();

      // Return more readable JSON results
      return await this.sparqlJsonParser.parseJsonResults(jsonResult);
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
  }
};
