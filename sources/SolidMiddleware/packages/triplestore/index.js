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
        headers.ACCEPT = 'application/n-triples';
      }
      const result = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/query', {
        method: 'POST',
        body: params.query,
        headers: headers
      });
      let out;
      if (params.query.includes('SELECT')) {
        const jsonResult = await result.json();
        if (params.accept.includes('json')) {
          out = await this.sparqlJsonParser.parseJsonResults(jsonResult);
        } else {
          out = jsonResult;
        }
      } else if (params.query.includes('CONSTRUCT')) {
        let rdfResult = await result.text();
        console.log(rdfResult);
        if (!params.accept.includes('json')) {
          out = rdfResult;
        } else {
          out = await jsonld.fromRDF(rdfResult, { format: 'application/n-quads' });
        }
      }
      // Return more readable JSON results
      return out;
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  }
};
