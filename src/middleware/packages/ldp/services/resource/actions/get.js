const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery, buildDereferenceQuery, getContainerFromUri, getSlugFromUri} = require('../../../utils');
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
        accept
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
      forceSemantic: { type: 'boolean', optional: true },
      aclVerified: { type: 'boolean', optional: true }
    },
    cache: {
      enabled: ctx => {
        // Check if container URI is a file, disable cache in this case
        const containerUri = getContainerFromUri(ctx.params.resourceUri);
        const containerSlug = getSlugFromUri(containerUri);
        return containerSlug !== 'files';
      },
      keys: ['resourceUri', 'accept', 'queryDepth', 'dereference', 'jsonContext', 'forceSemantic']
    },
    async handler(ctx) {
      const { resourceUri, forceSemantic, aclVerified } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      const { accept, queryDepth, dereference, jsonContext } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: resourceUri })),
        ...ctx.params
      };

      const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri }, { meta: { webId } });

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
          // Increase performance by using the 'system' bypass if ACL have already been verified
          webId: aclVerified ? 'system' : webId
        });

        // If we asked for JSON-LD, frame it using the correct context in order to have clean, consistent results
        if (accept === MIME_TYPES.JSON) {
          result = await ctx.call('jsonld.frame', {
            input: result,
            frame: {
              '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
              '@id': resourceUri
            }
          });
        }

        if ((result['@type'] === 'semapps:File' || result.type === 'semapps:File') && !forceSemantic) {
          try {
            // Overwrite response type set by the api action
            ctx.meta.$responseType = result['semapps:mimeType'];
            //Les fichiers sont immutables, on défini le cache à la valeur maximum
            ctx.meta.$responseHeaders = {
              'Cache-Control': 'public, max-age=31536000'
            };
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
