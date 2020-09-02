const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const jsonld = require('jsonld');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { id, containerUri } = ctx.params;
    const resourceUri = `${containerUri}/${id}`;
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
      queryDepth: { type: 'number', default: 0 },
      jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
    },
    async handler(ctx) {
      const { resourceUri, accept, webId, queryDepth, jsonContext } = ctx.params;

      const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri });

      if (resourceExist) {
        const [constructQuery, whereQuery] = buildBlankNodesQuery(queryDepth);

        let result = await ctx.call('triplestore.query', {
          query: `
            ${getPrefixRdf(this.settings.ontologies)}
            CONSTRUCT  {
              <${resourceUri}> ?p1 ?o1 .
              ${constructQuery}
            }
            WHERE {
              <${resourceUri}> ?p1 ?o1 .
              ${whereQuery}
            }
          `,
          accept,
          webId
        });

        // If we asked for JSON-LD, frame it using the correct context in order to have clean, consistent results
        if (accept === MIME_TYPES.JSON) {
          result = await jsonld.frame(result, {
            '@context': jsonContext || this.settings.defaultJsonContext || getPrefixJSON(this.settings.ontologies),
            '@id': resourceUri
          });

          // Remove the @graph as we have a single result
          result = {
            '@context': result['@context'],
            ...result['@graph'][0]
          };
        }

        return result;
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
