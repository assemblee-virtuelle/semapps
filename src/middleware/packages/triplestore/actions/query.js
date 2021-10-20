const fetch = require("node-fetch");
const { MIME_TYPES, negotiateType } = require("@semapps/mime-types");

module.exports = {
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

    const url = this.settings.sparqlEndpoint + this.settings.mainDataset + '/query';
    const response = await fetch(url, {
      method: 'POST',
      body: query,
      headers
    });
    if (!response.ok) {
      await this.handleError(url, response);
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
};
