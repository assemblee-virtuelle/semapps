const fs = require('fs');
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    const { typeURL, id, containerUri } = ctx.params;
    const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${id}`;
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });

    try {
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
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: 'string',
      webId: { type: 'string', optional: true },
      disassembly: { type: 'array', optional: true }
    },
    async handler(ctx) {
      const { resourceUri } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      if (this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
        return await ctx.call('ldp.remote.delete', { resourceUri, webId });
      }

      const { disassembly } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
        ...ctx.params
      };

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      let oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId
      });

      if (disassembly) {
        await this.deleteDisassembly(ctx, disassembly, oldData);
      }

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE {
            <${resourceUri}> ?p1 ?o1 .
          }
        `,
        webId
      });

      // We must detach the resource from the containers after deletion, otherwise the permissions may fail
      const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
      for (let containerUri of containers) {
        await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
      }

      if (oldData['@type'] === 'semapps:File') {
        fs.unlinkSync(oldData['semapps:localPath']);
      }

      const returnValues = {
        resourceUri,
        oldData,
        webId
      };

      ctx.call('triplestore.deleteOrphanBlankNodes');

      ctx.emit('ldp.resource.deleted', returnValues, { meta: { webId: null } });

      return returnValues;
    }
  }
};
