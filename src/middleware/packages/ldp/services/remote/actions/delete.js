module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId;

    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    if (this.settings.podProvider) {
      if (!webId || webId === 'system' || webId === 'anon') {
        throw new Error(`Cannot delete remote resource in cache without a webId (Provided: ${webId})`);
      }
      const account = await ctx.call('auth.account.findByWebId', { webId });
      ctx.meta.dataset = account.username;
    }

    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });
    if (!exist) throw new Error(`No document found with resource ${resourceUri} (webId: ${webId})`);

    const oldData = await this.actions.getStored({ resourceUri, webId }, { parentCtx: ctx });

    await ctx.call('triplestore.document.clear', { documentUri: resourceUri });
    await ctx.call('triplestore.document.delete', { documentUri: resourceUri });

    // Detach from all containers
    const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containers) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    const returnValues = {
      resourceUri,
      oldData,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.remote.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
};
