'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const {
  SparqlJsonParser
} = require('sparqljson-parse');
const {
  ACCEPT_TYPES
} = require('./constants');

module.exports = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  actions: {
    async insert({
      params
    }) {
      const rdf =
        typeof params.resource === 'string' || params.resource instanceof String ?
        params.resource :
        await jsonld.toRDF(params.resource, {
          format: 'application/n-quads'
        });

      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: `INSERT DATA { ${rdf} }`,
        headers: {
          'Content-Type': 'application/sparql-update',
          Authorization: this.Authorization
        }
      });

      if (!response.ok) throw new Error(response.statusText);

      return response;
    },
    async delete({
      params
    }) {
      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: `DELETE
            { <${params.uri}> ?p ?v }
            WHERE
            { <${params.uri}> ?p ?v }
            `,
        headers: {
          'Content-Type': 'application/sparql-update',
          Authorization: this.Authorization
        }
      });

      if (!response.ok) throw new Error(response.statusText);

      return response;

    },
    async query({
      params
    }) {
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

      if (!response.ok) throw new Error(response.statusText);

      // Return results as JSON or RDF
      if (params.query.includes('SELECT')) {
        const jsonResult = await response.json();
        if (params.accept === ACCEPT_TYPES.JSON) {
          return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        } else {
          return jsonResult;
        }
      } else if (params.query.includes('CONSTRUCT')) {
        if (params.accept === ACCEPT_TYPES.TURTLE || params.accept === ACCEPT_TYPES.TRIPLE) {
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
      switch (accept) {
        case ACCEPT_TYPES.TURTLE:
          return 'application/n-quad';
        case ACCEPT_TYPES.TRIPLE:
          return 'application/n-triples';
        case ACCEPT_TYPES.JSON:
          return 'application/ld+json, application/sparql-results+json';
        default:
          throw new Error('Unknown accept parameter: ' + accept);
      }
    }
  }
};
