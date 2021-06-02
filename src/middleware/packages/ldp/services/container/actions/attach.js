module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri }, { meta: { webId } });
    if (!resourceExists) {
      const childContainerExists = await this.actions.exist({ containerUri: resourceUri }, { parentCtx: ctx, meta: { webId } });
      if (!childContainerExists) {
        throw new Error('Cannot attach non-existing resource or container: ' + resourceUri);
      }
    }

    const containerExists = await this.actions.exist({ containerUri }, { parentCtx: ctx, meta: { webId } });
    if (!containerExists) throw new Error('Cannot attach to a non-existing container: ' + containerUri);

    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
      webId
    });

    ctx.emit('ldp.container.attached', {
      containerUri,
      resourceUri
    });
  }
};
