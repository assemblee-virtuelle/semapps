const fs = require('fs');
const { MoleculerError } = require('moleculer').Errors;

module.exports = async function get(ctx) {
  try {
    const { username, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      const { accept, controlledActions } = {
        ...(await ctx.call('ldp.registry.getByUri', { containerUri: uri })),
        ...ctx.meta.headers
      };

      const res = await ctx.call(controlledActions?.list || 'ldp.container.get', {
        containerUri: uri,
        accept
      });
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return res;
    } else if (types.includes('https://www.w3.org/ns/activitystreams#Collection')) {
      /*
       * AS COLLECTION
       */

      const { controlledActions } = await ctx.call('activitypub.registry.getByUri', { collectionUri: uri });

      const res = await ctx.call(controlledActions?.get || 'activitypub.collection.get', {
        collectionUri: uri,
        page: ctx.params.page
      });
      ctx.meta.$responseType = 'application/ld+json';
      return res;
    } else {
      /*
       * LDP RESOURCE
       */
      const { accept, controlledActions, preferredView } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri: uri })),
        ...ctx.meta.headers
      };

      if (ctx.meta.accepts && ctx.meta.accepts.includes('text/html') && this.settings.preferredViewForResource) {
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

      const resource = await ctx.call(controlledActions.get || 'ldp.resource.get', {
        resourceUri: uri,
        accept
      });

      if (types.includes('http://semapps.org/ns/core#File')) {
        try {
          const file = fs.readFileSync(resource['semapps:localPath']);
          ctx.meta.$responseType = resource['semapps:mimeType'];
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
        ctx.meta.$responseType = ctx.meta.$responseType || accept;
        return resource;
      }
    }
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
