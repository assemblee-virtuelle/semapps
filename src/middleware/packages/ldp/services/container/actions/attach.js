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
    const { containerUri, resourceUri, webId } = ctx.params;

    if (webId) ctx.meta.webId = webId;

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri });
    if (!resourceExists) throw new Error('Cannot attach non-existing resource: ' + resourceUri);

    const containerExists = await this.actions.exist({ containerUri }, { parentCtx: ctx });
    if (!containerExists) throw new Error('Cannot attach to a non-existing container: ' + containerUri);

    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`
    });

    ctx.emit('ldp.container.attached', {
      containerUri,
      resourceUri
    });
  }
};
