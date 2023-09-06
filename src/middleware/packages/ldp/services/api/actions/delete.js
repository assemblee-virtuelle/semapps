const { MoleculerError } = require('moleculer').Errors;

module.exports = async function patch(ctx) {
  try {
    const { dataset, slugParts } = ctx.params;
    const uri = this.getUriFromSlugParts(slugParts);

    // TODO put in cache
    const containersUris = await ctx.call('ldp.container.getAll', { dataset });
  
    if (containersUris.includes(uri)) {
      await ctx.call('ldp.container.delete', { containerUri: uri });
    } else {
      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });
      await ctx.call(controlledActions.delete || 'ldp.resource.delete', { resourceUri: uri });
    }

    ctx.meta.$statusCode = 204;
    ctx.meta.$responseHeaders = {
      Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'Content-Length': 0
    };
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
