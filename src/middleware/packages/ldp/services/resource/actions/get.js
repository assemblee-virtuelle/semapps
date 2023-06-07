const fs = require('fs');
const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const {
  getPrefixRdf,
  getPrefixJSON,
  buildDereferenceQuery,
  getContainerFromUri,
  getSlugFromUri
} = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { id, containerUri } = ctx.params;
    const resourceUri = urlJoin(containerUri, id);
    const { accept, controlledActions, preferredView } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.meta.headers
    };
    try {
      if (ctx.meta.accepts && ctx.meta.accepts.includes('text/html') && this.settings.preferredViewForResource) {
        const webId = ctx.meta.webId || 'anon';
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });
        if (resourceExist) {
          const redirect = await this.settings.preferredViewForResource.bind(this)(resourceUri, preferredView);
          if (redirect && redirect !== resourceUri) {
            ctx.meta.$statusCode = 302;
            ctx.meta.$location = redirect;
            ctx.meta.$responseHeaders = {
              'Content-Length': 0
            };
            return;
          }
        }
      }

      const res = await ctx.call(controlledActions.get || 'ldp.resource.get', {
        resourceUri,
        accept
      });
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return res;
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
      enabled(ctx) {
        // Do not cache remote resources as we have no mecanism to clear this cache
        if (!ctx.params.resourceUri.startsWith(this.settings.baseUrl)) return false;
        // Check if container URI is a file, disable cache in this case
        const containerUri = getContainerFromUri(ctx.params.resourceUri);
        const containerSlug = getSlugFromUri(containerUri);
        return containerSlug !== 'files';
      },
      keys: ['resourceUri', 'accept', 'dereference', 'jsonContext', 'forceSemantic']
    },
    async handler(ctx) {
      const { resourceUri, forceSemantic, aclVerified } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      if (this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
        return await ctx.call('ldp.remote.get', ctx.params);
      }

      const { accept, dereference, jsonContext } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
        ...ctx.params
      };

      const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });

      if (resourceExist) {
        const dereferenceQuery = buildDereferenceQuery(dereference);

        let result = await ctx.call('triplestore.query', {
          query: `
            ${getPrefixRdf(this.settings.ontologies)}
            CONSTRUCT  {
              ?s1 ?p1 ?o1 .
              ${dereferenceQuery.construct}
            }
            WHERE {
              BIND(<${resourceUri}> AS ?s1) .
              ?s1 ?p1 ?o1 .
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
            const file = fs.readFileSync(result['semapps:localPath']);
            // Overwrite response type set by the api action
            ctx.meta.$responseType = result['semapps:mimeType'];
            // Since files are currently immutable, we set a maximum browser cache age
            // We do that after the file is read, otherwise the error 404 will be cached by the browser
            ctx.meta.$responseHeaders = {
              'Cache-Control': 'public, max-age=31536000'
            };
            return file;
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
