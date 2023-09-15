const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = async function post(ctx) {
  try {
    const { username, slugParts, ...resource } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */
      let resourceUri;
      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri: uri });
      if (ctx.meta.parser !== 'file') {
        resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
          containerUri: uri,
          slug: ctx.meta.headers.slug,
          resource,
          contentType: ctx.meta.headers['content-type']
        });
      } else {
        if (ctx.params.files.length > 1) {
          throw new MoleculerError(`Multiple file upload not supported`, 400, 'BAD_REQUEST');
        }
        resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
          containerUri: uri,
          slug: ctx.meta.headers.slug || ctx.params.files[0].filename,
          file: ctx.params.files[0],
          contentType: MIME_TYPES.JSON
        });
      }
      ctx.meta.$responseHeaders = {
        Location: resourceUri,
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
      ctx.meta.$statusCode = 201;
    } else if (types.includes('https://www.w3.org/ns/activitystreams#Collection')) {
      /*
       * AS COLLECTION
       */
      const { controlledActions } = await ctx.call('activitypub.registry.getByUri', { collectionUri: uri });

      if (controlledActions.post) {
        await ctx.call(controlledActions.post, {
          collectionUri: uri,
          ...resource
        });
      } else {
        // The collection endpoint is not available for POSTing
        ctx.meta.$statusCode = 404;
      }
    }
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
