const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');
const { MIME_TYPES, negotiateType } = require('@semapps/mime-types');
const { throw403, throw500 } = require('@semapps/middlewares');

const handleError = async function(url, response){
  let text = await response.text();
  if (response.status == 403)
    throw403(text);
  else {
    console.log(text)
    // the 3 lines below (until the else) can be removed once we switch to jena-fuseki version 4.0.0 or above
    if (response.status == 500 && text.includes('permissions violation')) 
     throw403(text);
    else
      throw500(`Unable to reach SPARQL endpoint ${url}. Error message: ${response.statusText}`);
  }
}

const TripleStoreService = {
  name: 'triplestore',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  },
  actions: {
    insert: {
      visibility: 'public',
      params: {
        resource: {
          type: 'multi',
          rules: [{ type: 'string' }, { type: 'object' }]
        },
        contentType: {
          type: 'string',
          optional: true
        },
        webId: {
          type: 'string',
          optional: true
        },
        graphName: {
          type: 'string',
          optional: true
        }
      },
      async handler(ctx) {
        const { resource, contentType, webId, graphName } = ctx.params;

        let rdf;
        if (contentType !== MIME_TYPES.JSON) {
          rdf = resource;
        } else {
          rdf = await jsonld.toRDF(resource, {
            format: 'application/n-quads'
          });
        }

        const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
        const response = await fetch(url, {
          method: 'POST',
          body: graphName ? `INSERT DATA { GRAPH ${graphName} { ${rdf} } }` : `INSERT DATA { ${rdf} }`,
          headers: {
            'Content-Type': 'application/sparql-update',
            'X-SemappsUser': webId || ctx.meta.webId || 'anon',
            Authorization: this.Authorization
          }
        });

        if (!response.ok){
          await handleError(url, response);
        }
      }
    },
    countTriplesOfSubject: {
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
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
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
    update: {
      visibility: 'public',
      params: {
        query: {
          type: 'string'
        },
        webId: {
          type: 'string',
          optional: true
        }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId  || 'anon';
        const query = ctx.params.query;

        const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
        const response = await fetch(url, {
          method: 'POST',
          body: query,
          headers: {
            'Content-Type': 'application/sparql-update',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });

        if (!response.ok){
          await handleError(url, response);
        }
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
          type: 'string',
          default: MIME_TYPES.JSON
        }
      },
      async handler(ctx) {
        const { accept, webId, query } = ctx.params;
        const acceptNegotiatedType = negotiateType(accept);
        const acceptType = acceptNegotiatedType.mime;
        const headers = {
          'Content-Type': 'application/sparql-query',
          'X-SemappsUser': webId || ctx.meta.webId || 'anon',
          Authorization: this.Authorization,
          Accept: acceptNegotiatedType.fusekiMapping
        };

        //console.log('XXX USER ',webId || ctx.meta.webId || 'anon');

        const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/query';
        const response = await fetch(url, {
          method: 'POST',
          body: query,
          headers
        });
        if (!response.ok) {
          await handleError(url, response);
        }

        // we don't use the property ctx.meta.$responseType because we are not in a HTTP API call here
        // we are in an moleculer Action.
        // we use a different name (without the $) and then retrieve this value in the API action (sparqlendpoint.query) to set the $responseType
        ctx.meta.responseType = response.headers.get('content-type');

        const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
        const verb = regex.exec(query)[1];
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
            if (acceptType === MIME_TYPES.JSON || acceptType === MIME_TYPES.SPARQL_JSON) {
              const jsonResult = await response.json();
              return await this.sparqlJsonParser.parseJsonResults(jsonResult);
            } else {
              return await response.text();
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
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';

        const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/update';
        const response = await fetch(url, {
          method: 'POST',
          body: 'update=CLEAR+ALL',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-SemappsUser': webId,
            Authorization: this.Authorization
          }
        });

        if (!response.ok){
          await handleError(url, response);
        }

        return response;
      }
    }
  }
};

module.exports = {
  TripleStoreService
};
