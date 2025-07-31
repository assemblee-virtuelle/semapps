const fs = require('fs');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.delete', { resourceUri, webId });
    }

    await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Write', webId });

    // Save the current data, to be able to send it through the event
    // If the resource does not exist, it will throw a 404 error
    const oldData = await ctx.call(
      'ldp.resource.get',
      {
        resourceUri,
        webId
      },
      {
        meta: {
          $cache: false
        }
      }
    );

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
    const containersUris = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containersUris) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    if (oldData.type === 'semapps:File') {
      try {
        fs.unlinkSync(oldData['semapps:localPath']);
      } catch (e) {
        // Ignore errors (file may have been deleted already)
      }
    }

    const returnValues = {
      resourceUri,
      containersUris,
      oldData,
      webId,
      dataset: ctx.meta.dataset
    };

    ctx.call('triplestore.deleteOrphanBlankNodes');

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
};
