'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const {
  SparqlJsonParser
} = require('sparqljson-parse');
const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const {
  MIME_TYPES,
  negotiateType,
  negotiateTypeMime
} = require('@semapps/mime-types');

const TripleStoreService = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  actions: {
    insert: {
      visibility: 'public',
      params: {
        resource: {
          type: 'object'
        },
        webId: {
          type: 'string',
          optional: true
        },
        contentType: {
          type: 'string'
        }
      },
      async handler(ctx) {
        const {
          params
        } = ctx;
        const webId = ctx.params.webId || ctx.meta.webId;
        const contentType = ctx.params.contentType;
        const type = negotiateTypeMime(contentType);
        let rdf;
        if (type != MIME_TYPES.JSON) {
          rdf = params.resource;
        } else {
          rdf = await jsonld.toRDF(params.resource, {
            format: 'application/n-quads'
          });
        }

        const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
          method: 'POST',
          body: `INSERT DATA { ${rdf} }`,
          headers: {
            'Content-Type': 'application/sparql-update',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });

        if (!response.ok) throw new Error(response.statusText);
      }
    },
    patch: {
      visibility: 'public',
      params: {
        resource: {
          type: 'object'
        },
        webId: {
          type: 'string',
          optional: true
        },
        contentType: {
          type: 'string'
        }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const contentType = ctx.params.contentType;
        const query = await this.buildPatchQuery(ctx.params);
        const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
          method: 'POST',
          body: query,
          headers: {
            'Content-Type': 'application/sparql-update',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });
        if (!response.ok) throw new Error(response.statusText);
      }
    },
    delete: {
      visibility: 'public',
      params: {
        uri: {
          type: 'string'
        },
        webId: {
          type: 'string',
          optional: true
        }
      },
      async handler(ctx) {
        const {
          params
        } = ctx;
        const webId = ctx.params.webId || ctx.meta.webId;
        const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
          method: 'POST',
          body: `DELETE
              WHERE
              { <${params.uri}> ?p ?v }
              `,
          headers: {
            'Content-Type': 'application/sparql-update',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });

        if (!response.ok) throw new Error(response.statusText);

        return response;
      }
    },
    countTripleOfSubject: {
      visibility: 'public',
      params: {
        uri: {
          type: 'string'
        },
        webId: {
          type: 'string',
          optional: true
        }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const results = await ctx.call('triplestore.query', {
          query: `
            SELECT ?p ?v
            WHERE {
              <${ctx.params.uri}> ?p ?v
            }
          `,
          accept: MIME_TYPES.JSON,
          webId: webId
        });
        return results.length;
      }
    },
    query: {
      visibility: 'public',
      params: {
        query: {
          type: 'string'
        },
        webId: {
          type: 'string',
          optional: true
        },
        accept: {
          type: 'string'
        }
      },
      async handler(ctx) {
        const {
          params
        } = ctx;
        const accept = ctx.params.accept;
        const webId = ctx.params.webId || ctx.meta.webId;
        const acceptNegociatedType = negotiateType(accept);
        const acceptType = acceptNegociatedType.mime;
        const fueskiAccept = acceptNegociatedType.fusekiMapping;
        const headers = {
          'Content-Type': 'application/sparql-query',
          'X-SemappsUser': webId,
          Authorization: this.Authorization,
          Accept: fueskiAccept
        };

        const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/query', {
          method: 'POST',
          body: params.query,
          headers
        });
        if (!response.ok) throw new Error(response.statusText);
        const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
        const verb = regex.exec(params.query)[1];
        switch (verb) {
          case 'ASK':
            if (acceptType === MIME_TYPES.JSON) {
              const jsonResult = await response.json();
              return jsonResult.boolean;
            } else {
              throw new Error('Only JSON accept type is currently allowed for ASK queries');
            }
            break;
          case 'SELECT':
            const jsonResult = await response.json();
            if (acceptType === MIME_TYPES.JSON) {
              return await this.sparqlJsonParser.parseJsonResults(jsonResult);
            } else {
              return jsonResult;
            }
            break;
          case 'CONSTRUCT':
            if (acceptType === MIME_TYPES.TURTLE || acceptType === MIME_TYPES.TRIPLE) {
              return await response.text();
            } else {
              return await response.json();
            }
            break;
          default:
            throw new Error('SPARQL Verb not supported');
        }
      }
    },
    dropAll: {
      visibility: 'public',
      params: {
        webId: {
          type: 'string',
          optional: true
        }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const response = await fetch(this.settings.sparqlEndpoint + this.settings.mainDataset + '/update', {
          method: 'POST',
          body: 'update=DROP+ALL',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });

        if (!response.ok) throw new Error(response.statusText);

        return response;
      }
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  },
  methods: {
    buildPatchQuery(params) {
      return new Promise((resolve, reject) => {
        let deleteSPARQL = '';
        let insertSPARQL = '';
        let counter = 0;
        let query;
        const text =
          typeof params.resource === 'string' || params.resource instanceof String ?
          params.resource :
          JSON.stringify(params.resource);
        const textStream = streamifyString(text);
        rdfParser
          .parse(textStream, {
            contentType: 'application/ld+json'
          })
          .on('data', quad => {
            deleteSPARQL = deleteSPARQL.concat(
              `DELETE WHERE  {<${quad.subject.value}> <${quad.predicate.value}> ?o};
              `
            );
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
            insertSPARQL = insertSPARQL.concat('.');
            query = `
            ${deleteSPARQL}
            INSERT DATA {${insertSPARQL}};
            `;
            resolve(query);
          });
      });
    }
  }
};

module.exports = {
  TripleStoreService
};
