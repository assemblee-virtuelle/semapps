const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const jsonld = require('jsonld');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery, buildDereferenceQuery } = require('../../../utils');
const fs = require('fs');

module.exports = {
  api: async function api(ctx) {
    const { id, containerUri } = ctx.params;
    const resourceUri = `${containerUri}/${id}`;
    const { accept } = { ...(await ctx.call('ldp.container.getOptions', { uri: resourceUri })), ...ctx.meta.headers };
    try {
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return await ctx.call('ldp.resource.get', {
        resourceUri,
        accept,
        webId: ctx.meta.webId
      });
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
      accept: { type: 'string', optional: true },
      queryDepth: { type: 'number', optional: true },
      dereference: { type: 'array', optional: true },
      jsonContext: {
        type: 'multi',
        rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
        optional: true
      },
      forceSemantic: { type: 'boolean', optional: true }
    },
    cache: {
      keys: ['resourceUri', 'accept', 'queryDepth', 'dereference', 'jsonContext']
    },
    async handler(ctx) {
      const { resourceUri, webId, forceSemantic } = ctx.params;
      const { accept, queryDepth, dereference, jsonContext } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: resourceUri })),
        ...ctx.params
      };

      const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri });

      if (resourceExist) {
        const blandNodeQuery = buildBlankNodesQuery(queryDepth);
        const dereferenceQuery = buildDereferenceQuery(dereference);
        let result = await ctx.call('triplestore.query', {
          query: `
            ${getPrefixRdf(this.settings.ontologies)}
            CONSTRUCT  {
              ?s1 ?p1 ?o1 .
              ${blandNodeQuery.construct}
              ${dereferenceQuery.construct}
            }
            WHERE {
              BIND(<${resourceUri}> AS ?s1) .
              ?s1 ?p1 ?o1 .
              ${blandNodeQuery.where}
              ${dereferenceQuery.where}
            }
          `,
          accept,
          webId
        });

        // If we asked for JSON-LD, frame it using the correct context in order to have clean, consistent results
        if (accept === MIME_TYPES.JSON) {
          result = await jsonld.frame(result, {
            '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
            '@id': resourceUri
          });

          // Remove the @graph as we have a single result
          result = {
            '@context': result['@context'],
            ...result['@graph'][0]
          };
        }

        if ((result['@type'] === 'semapps:File' || result.type === 'semapps:File') && !forceSemantic) {
          try {
            // Overwrite response type set by the api action
            // TODO put this in the API action
            ctx.meta.$responseType = result['semapps:mimeType'];
            return fs.readFileSync(result['semapps:localPath']);
          } catch (e) {
            throw new MoleculerError('File Not found', 404, 'NOT_FOUND');
          }
        } else {
          return result;
        }
      } else {
        throw new MoleculerError('Resource Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
