'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');
const { ACCEPT_TYPES } = require('./constants');
const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');

module.exports = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  actions: {
    async insert({ params }) {
      const rdf =
        typeof params.resource === 'string' || params.resource instanceof String
          ? params.resource
          : await jsonld.toRDF(params.resource, {
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
    async patch(ctx) {
      const query = await this.buildPatchQuery(ctx.params);

      console.log('query', query);

      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/sparql-update',
          Authorization: this.Authorization
        }
      });

      if (!response.ok) throw new Error(response.statusText);

      return response;
    },
    async delete({ params }) {
      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: `DELETE
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
    async countTripleOfSubject(ctx) {
      const results = await ctx.call('triplestore.query', {
        query: `
          SELECT ?p ?v
          WHERE {
            <${ctx.params.uri}> ?p ?v
          }
        `,
        accept: 'json'
      });
      return results.length;
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
    },
    async dropAll({ params }) {
      const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
        method: 'POST',
        body: 'update=DROP+ALL',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: this.Authorization
        }
      });

      if (!response.ok) throw new Error(response.statusText);

      return response;
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
    },
    buildPatchQuery: params => {
      return new Promise((resolve, reject) => {
        let deleteSPARQL = '';
        let insertSPARQL = '';
        let counter = 0;
        let query;
        const text =
          typeof params.resource === 'string' || params.resource instanceof String
            ? params.resource
            : JSON.stringify(params.resource);
        const textStream = streamifyString(text);
        rdfParser
          .parse(textStream, {
            contentType: 'application/ld+json'
          })
          .on('data', quad => {
            if (deleteSPARQL.length === 0) {
              deleteSPARQL = deleteSPARQL.concat(`<${quad.subject.value}>`);
            } else {
              deleteSPARQL = deleteSPARQL.concat(';');
            }
            deleteSPARQL = deleteSPARQL.concat(` <${quad.predicate.value}> ?${counter}`);

            if (insertSPARQL.length === 0) {
              insertSPARQL = insertSPARQL.concat(`<${quad.subject.value}>`);
            } else {
              insertSPARQL = insertSPARQL.concat(';');
            }

            if (quad.object.value.startsWith('http')) {
              insertSPARQL = insertSPARQL.concat(` <${quad.predicate.value}> <${quad.object.value}>`);
            } else {
              insertSPARQL = insertSPARQL.concat(
                ` <${quad.predicate.value}> "${quad.object.value.replace(/(\r\n|\r|\n)/g, '\\n')}"`
              );
            }

            if (quad.object.datatype !== undefined && !quad.object.value.startsWith('http')) {
              insertSPARQL = insertSPARQL.concat(`^^<${quad.object.datatype.value}>`);
            }

            counter++;
          })
          .on('error', error => console.error(error))
          .on('end', () => {
            deleteSPARQL = deleteSPARQL.concat('.');
            insertSPARQL = insertSPARQL.concat('.');
            query = `DELETE {${deleteSPARQL}}
            INSERT {${insertSPARQL}}
            WHERE  {${deleteSPARQL}}`;
            resolve(query);
          });
      });
    }
  }
};
