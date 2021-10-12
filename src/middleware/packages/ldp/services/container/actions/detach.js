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
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const containerExists = await this.actions.exist({ containerUri }, { parentCtx: ctx, meta: { webId } });
    if (!containerExists) throw new Error('Cannot detach from a non-existing container: ' + containerUri);

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE
        { <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }
      `,
      webId
    });

    ctx.emit('ldp.container.detached', {
      containerUri,
      resourceUri
    });
  }
};
