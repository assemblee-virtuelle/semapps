const urlJoin = require('url-join');
const { MIME_TYPES, negotiateType } = require('@semapps/mime-types');

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
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    if (!dataset) throw new Error('No dataset defined for triplestore query: ' + query);

    const acceptNegotiatedType = negotiateType(accept);
    const acceptType = acceptNegotiatedType.mime;

    const response = await this.fetch(urlJoin(this.settings.url, dataset, 'query'), {
      body: query,
      headers: {
        'Content-Type': 'application/sparql-query',
        'X-SemappsUser': webId,
        Accept: acceptNegotiatedType.fusekiMapping
      }
    });

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
      case 'SELECT':
        if (acceptType === MIME_TYPES.JSON || acceptType === MIME_TYPES.SPARQL_JSON) {
          const jsonResult = await response.json();
          return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        } else {
          return await response.text();
        }
      case 'CONSTRUCT':
        if (acceptType === MIME_TYPES.TURTLE || acceptType === MIME_TYPES.TRIPLE) {
          return await response.text();
        } else {
          return await response.json();
        }
      default:
        throw new Error('SPARQL Verb not supported');
    }
  }
};
