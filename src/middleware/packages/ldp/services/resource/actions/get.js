const fs = require('fs');
const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery, buildDereferenceQuery } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { id, containerUri } = ctx.params;
    const resourceUri = urlJoin(containerUri, id);
    const { accept, controlledActions } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.meta.headers
    };
    try {
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return await ctx.call(controlledActions ? controlledActions.get : 'ldp.resource.get', {
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
      enabled: function(ctx) {
        //On regarde si le containerURI est celui d'un fichier, pas de cache si c'est le cas
        return /[^/]*$/.exec(ctx.options.parentCtx.params.containerUri)[0] !== 'files';
      },
      keys: ['resourceUri', 'accept', 'queryDepth', 'dereference', 'jsonContext', 'forceSemantic']
    },
    async handler(ctx) {
      const { resourceUri, forceSemantic, aclVerified } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      const { accept, queryDepth, dereference, jsonContext } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
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
          // TODO simply set meta.webId to "system", it will be taken into account in the triplestore.query action
          // The problem is we need to know the real webid for the permissions, but we can remember it in the WebACL middleware
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
            // Since files are currently immutable, we set a maximum browser cache age
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
