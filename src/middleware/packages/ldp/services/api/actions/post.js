module.exports = async function post(ctx) {
  try {
    const { dataset, slugParts, ...resource } = ctx.params;

    const containerUri = this.getUriFromSlugParts(slugParts);
  
    let resourceUri;
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
    if (ctx.meta.parser !== 'file') {
      resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
        containerUri,
        slug: ctx.meta.headers.slug,
        resource,
        contentType: ctx.meta.headers['content-type']
      });
    } else {
      if (ctx.params.files.length > 1) {
        throw new MoleculerError(`Multiple file upload not supported`, 400, 'BAD_REQUEST');
      }
      resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
        containerUri,
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
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
