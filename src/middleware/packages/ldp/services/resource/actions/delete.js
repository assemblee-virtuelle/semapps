const fs = require('fs');
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    if (this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
      return await ctx.call('ldp.remote.delete', { resourceUri, webId });
    }

    // Save the current data, to be able to send it through the event
    // If the resource does not exist, it will throw a 404 error
    const oldData = await ctx.call('ldp.resource.get', {
      resourceUri,
      accept: MIME_TYPES.JSON,
      webId
    });

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
    for (const containerUri of containers) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    if (oldData['type'] === 'semapps:File') {
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
};
