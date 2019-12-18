'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');

module.exports = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  actions: {
    async insert({ params }) {
      // Transforms JSONLD to RDF
      const rdf = await jsonld.toRDF(params.resource, {
        format: 'application/n-quads'
      });
      return await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: `INSERT DATA { ${rdf} }`,
        headers: {
          'Content-Type': 'application/sparql-update',
          Authorization: this.Authorization
        }
      });
    },
    async query({ params }) {
      const headers = {
        'Content-Type': 'application/sparql-query',
        Authorization: this.Authorization,
        Accept: this.getAcceptHeader(params.accept)
      };

      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/query', {
        method: 'POST',
        body: params.query,
        headers
      });

      if( !response.ok ) throw new Error(response.statusText);

      // Return results as JSON or RDF
      if (params.query.includes('SELECT')) {
        const jsonResult = await response.json();
        if (params.accept === 'json') {
          return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        } else {
          return jsonResult;
        }
      } else if (params.query.includes('CONSTRUCT')) {
        if (params.accept === 'turtle') {
          return await response.text();
        } else {
          return await response.json();
        }
      }
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  },
  methods: {
    getAcceptHeader: accept => {
      switch(accept) {
        case 'turtle':
          return  'application/n-triples';
        case 'json':
          return 'application/ld+json';
        default:
          throw new Error('Unknown accept parameter: ' + accept )
      }
    }
  }
};
