module.exports = async function get(ctx) {
  try {
    const { dataset, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts);

    // TODO put in cache
    const containersUris = await ctx.call('ldp.container.getAll', { dataset });

    if (containersUris.includes(uri)) {
      /*
       * LDP CONTAINER
       */

      const { accept, controlledActions } = {
        ...(await ctx.call('ldp.registry.getByUri', { containerUri: uri })),
        ...ctx.meta.headers
      };

      const res = await ctx.call(controlledActions.list || 'ldp.container.get', {
        containerUri: uri,
        accept
      });
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return res;
    }
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

    const res = await ctx.call(controlledActions.get || 'ldp.resource.get', {
      resourceUri: uri,
      accept
    });
    ctx.meta.$responseType = ctx.meta.$responseType || accept;
    return res;
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
