const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const jsonld = require('jsonld');
const { getPrefixRdf, getPrefixJSON } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { typeURL, resourceId, containerUri } = ctx.params;
    const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${resourceId}`;
    const accept = ctx.meta.headers.accept;
    try {
      const body = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept
      });
      ctx.meta.$responseType = accept;
      return body;
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string' },
      webId: { type: 'string', optional: true },
      accept: { type: 'string' }
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resourceUri;
      const accept = ctx.params.accept;
      if (ctx.params.webId) {
        ctx.meta.webId = ctx.params.webId;
      }
      const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resourceUri
      });

      if (triplesNb > 0) {
        let result = await ctx.call('triplestore.query', {
          query: `
            ${getPrefixRdf(this.settings.ontologies)}
            CONSTRUCT
            WHERE {
              <${resourceUri}> ?predicate ?object.
            }
          `,
          accept: accept
        });
        // If we asked for JSON-LD, compact it using our ontologies in order to have clean, consistent results
        if (accept === MIME_TYPES.JSON) {
          result = await jsonld.compact(result, getPrefixJSON(this.settings.ontologies));
        }
        return result;
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
