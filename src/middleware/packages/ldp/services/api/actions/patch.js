const { MoleculerError } = require('moleculer').Errors;

module.exports = async function patch(ctx) {
  try {
    const { dataset, slugParts, body } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts);

    // TODO put in cache
    const containersUris = await ctx.call('ldp.container.getAll', { dataset });

    if (ctx.meta.parser === 'sparql') {
      if (containersUris.includes(uri)) {
        /*
         * LDP CONTAINER
         */

        await ctx.call('ldp.container.patch', {
          containerUri: uri,
          sparqlUpdate: body,
        });
      } else {
        /*
         * LDP RESOURCE
         */

        const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });

        await ctx.call(controlledActions.patch || 'ldp.resource.patch', {
          resourceUri: uri,
          sparqlUpdate: body,
        });
      }
    } else {
      throw new MoleculerError(`The content-type should be application/sparql-update`, 400, 'BAD_REQUEST');
    }
    ctx.meta.$responseHeaders = {
      'Content-Length': 0,
    };
    ctx.meta.$statusCode = 204;
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
