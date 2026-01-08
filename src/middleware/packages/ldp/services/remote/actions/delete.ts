import { ActionSchema } from 'moleculer';

const DeleteAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId;

    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (dataset ${ctx.meta.dataset})`);
    }

    await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Write', webId });

    const exist = await ctx.call('triplestore.named-graph.exist', { uri: resourceUri });
    if (!exist) throw new Error(`No named graph found with resource ${resourceUri} (dataset: ${ctx.meta.dataset})`);

    const oldData = await this.actions.getStored({ resourceUri, webId: 'system' }, { parentCtx: ctx });

    await ctx.call('triplestore.named-graph.clear', { uri: resourceUri });
    await ctx.call('triplestore.named-graph.delete', { uri: resourceUri });

    // Detach from all containers
    const containersUris: string[] = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containersUris) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    const returnValues = {
      resourceUri,
      oldData,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.remote.deleted', returnValues);
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default DeleteAction;
