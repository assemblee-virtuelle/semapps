const { MoleculerError } = require('moleculer').Errors;

module.exports = async function patch(ctx) {
  try {
    const { dataset, slugParts } = ctx.params;

    const resourceUri = this.getUriFromSlugParts(slugParts);

    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri });

    await ctx.call(controlledActions.delete || 'ldp.resource.delete', {
      resourceUri
    });
    ctx.meta.$statusCode = 204;
    ctx.meta.$responseHeaders = {
      Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'Content-Length': 0
    };
  } catch (e) {
    console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
