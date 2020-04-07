const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const jsonld = require('jsonld');
const { getPrefixRdf, getPrefixJSON } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { typeURL, id, containerUri } = ctx.params;
    const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${id}`;
    const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
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
      accept: { type: 'string' },
      level: { type: 'number', default: 0 },
      jsonContext: { type: 'multi', rules: [ { type: 'array' }, { type: 'object' }, { type: 'string' } ], optional: true }
    },
    async handler(ctx) {
      const { resourceUri, accept, webId, level, jsonContext } = ctx.params;

      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri
      });

      if (triplesNb > 0) {
        const query = level === 0
          ? `
              ${getPrefixRdf(this.settings.ontologies)}
              CONSTRUCT
              WHERE {
                <${resourceUri}> ?rP ?rO .
              }
            `
          : `
              ${getPrefixRdf(this.settings.ontologies)}
              CONSTRUCT  {
                 <${resourceUri}> ?rP ?rO .
                 ?rO ?srP ?srO . 
              }
              WHERE {
                <${resourceUri}> ?rP ?rO .
                OPTIONAL { ?rO ?srP ?srO . }
              }
            `;

        let result = await ctx.call('triplestore.query', {
          query,
          accept,
          webId
        });

        // If we asked for JSON-LD, compact it using our ontologies in order to have clean, consistent results
        if (accept === MIME_TYPES.JSON) {
          if( level === 0 ) {
            result = await jsonld.compact(result, jsonContext || getPrefixJSON(this.settings.ontologies));
          } else {
            result = await jsonld.frame(result, {
              '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
              '@id': resourceUri
            });

            result = {
              '@context': result['@context'],
              ...result['@graph'][0]
            };
          }
        }
        return result;
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
