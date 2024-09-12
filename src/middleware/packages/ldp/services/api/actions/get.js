const fs = require('fs');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { cleanUndefined, parseJson } = require('../../../utils');

module.exports = async function get(ctx) {
  try {
    const { username, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    let res;

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      const { accept, controlledActions } = {
        ...(await ctx.call('ldp.registry.getByUri', { containerUri: uri })),
        ...ctx.meta.headers
      };

      res = await ctx.call(
        controlledActions?.list || 'ldp.container.get',
        cleanUndefined({
          containerUri: uri,
          accept,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext)
        })
      );

      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      if (ctx.meta.$responseType === 'application/ld+json')
        ctx.meta.$responseType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;
    } else {
      /*
       * LDP RESOURCE
       */
      const { accept, controlledActions, preferredView } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri: uri })),
        ...ctx.meta.headers
      };

      if (ctx.meta.originalHeaders?.accept?.includes('text/html') && this.settings.preferredViewForResource) {
        const webId = ctx.meta.webId || 'anon';
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: uri, webId });
        if (resourceExist) {
          const redirect = await this.settings.preferredViewForResource.bind(this)(uri, preferredView);
          if (redirect && redirect !== uri) {
            ctx.meta.$statusCode = 302;
            ctx.meta.$location = redirect;
            ctx.meta.$responseHeaders = {
              'Content-Length': 0
            };
            return;
          }
        }
      }

      res = await ctx.call(
        controlledActions.get || 'ldp.resource.get',
        cleanUndefined({
          resourceUri: uri,
          accept,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext)
        })
      );

      // If the resource is a file and no semantic encoding was requested, return it
      if (
        types.includes('http://semapps.org/ns/core#File') &&
        ![MIME_TYPES.JSON, MIME_TYPES.TURTLE].includes(ctx.meta.originalHeaders?.accept)
      ) {
        try {
          const file = fs.readFileSync(res['semapps:localPath']);
          ctx.meta.$responseType = res['semapps:mimeType'];
          // Since files are currently immutable, we set a maximum browser cache age
          // We do that after the file is read, otherwise the error 404 will be cached by the browser
          ctx.meta.$responseHeaders = {
            'Cache-Control': 'public, max-age=31536000',
            Vary: 'Accept'
          };
          return file;
        } catch (e) {
          throw new MoleculerError('File Not found', 404, 'NOT_FOUND');
        }
      } else {
        ctx.meta.$responseType = ctx.meta.$responseType || accept;
        if (ctx.meta.$responseType === 'application/ld+json')
          ctx.meta.$responseType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;
      }
    }

    if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
    ctx.meta.$responseHeaders.Link = await ctx.call('ldp.link-header.get', { uri });

    return res;
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
