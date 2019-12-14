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
      let headers = {
        'Content-Type': 'application/sparql-query',
        Authorization: this.Authorization
      };
      if (!params.accept.includes('turtle')) {
        headers.Accept = 'application/n-triples';
      }
      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/query', {
        method: 'POST',
        body: params.query,
        headers: headers
      });

      // Return results as JSON or RDF
      if (params.query.includes('SELECT')) {
        const jsonResult = await response.json();
        if (params.accept.includes('json')) {
          return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        } else {
          return jsonResult;
        }
      } else if (params.query.includes('CONSTRUCT')) {
        let rdfResult = await response.text();
        if (!params.accept.includes('json')) {
          return rdfResult;
        } else {
          return await jsonld.fromRDF(rdfResult, { format: 'application/n-quads' });
        }
      }
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  }
};
