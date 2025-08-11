const urlJoin = require('url-join');
const { MIME_TYPES, negotiateType } = require('@semapps/mime-types');
const ng = require('nextgraph');
const { Writer } = require('n3');

module.exports = {
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object' }]
    },
    accept: {
      type: 'string',
      default: MIME_TYPES.JSON
    },
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { accept, query } = ctx.params;
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore query: ${query}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    const acceptNegotiatedType = negotiateType(accept);
    const acceptType = acceptNegotiatedType.mime;

    // const response = await this.fetch(urlJoin(this.settings.url, dataset, 'query'), {
    //   body: query,
    //   headers: {
    //     'Content-Type': 'application/sparql-query',
    //     Accept: acceptNegotiatedType.fusekiMapping
    //   }
    // });
    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      const result = await ng.sparql_query(session.session_id, query);
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });

      // we don't use the property ctx.meta.$responseType because we are not in a HTTP API call here
      // we are in an moleculer Action.
      // we use a different name (without the $) and then retrieve this value in the API action (sparqlendpoint.query) to set the $responseType
      // ctx.meta.responseType = response.headers.get('content-type');

      const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
      const verb = regex.exec(query)[1];
      switch (verb) {
        case 'ASK':
          if (acceptType === MIME_TYPES.JSON) {
            // const jsonResult = await response.json();
            // return jsonResult.boolean;
            return result;
          }
          throw new Error('Only JSON accept type is currently allowed for ASK queries');

        case 'SELECT':
          if (acceptType === MIME_TYPES.JSON || acceptType === MIME_TYPES.SPARQL_JSON) {
            return await this.sparqlJsonParser.parseJsonResults(result);
          }
          return result;
        // if (acceptType === MIME_TYPES.JSON || acceptType === MIME_TYPES.SPARQL_JSON) {
        //   const jsonResult = await response.json();
        //   return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        // }
        // return await response.text();

        case 'CONSTRUCT':
          if (acceptType === MIME_TYPES.TURTLE || acceptType === MIME_TYPES.TRIPLE) {
            return result;
          }
          return await this.convertRdfJsToTurtle(result);
        // if (acceptType === MIME_TYPES.TURTLE || acceptType === MIME_TYPES.TRIPLE) {
        //   return await response.text();
        // }
        // return await response.json();

        default:
          throw new Error('SPARQL Verb not supported');
      }
    } catch (error) {
      this.logger.error(`Failed to query dataset ${dataset}:`, error);
      throw error;
    }
  },
  methods: {
    convertRdfJsToTurtle(quads) {
      return new Promise((resolve, reject) => {
        const writer = new Writer({
          format: 'Turtle',
          prefixes: {
            // Add common prefixes if needed
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            xsd: 'http://www.w3.org/2001/XMLSchema#'
          }
        });

        // Add all quads
        quads.forEach(quad => {
          writer.addQuad(quad);
        });

        // Get the result
        writer.end((error, result) => {
          if (error) {
            this.logger.error('Error converting to Turtle:', error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
};
