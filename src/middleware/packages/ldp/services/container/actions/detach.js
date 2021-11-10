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
    const dataset = ctx.meta.dataset; // Save dataset, so that it is not modified by action calls before

    const containerExists = await this.actions.exist({ containerUri }, { parentCtx: ctx });
    if (!containerExists) throw new Error('Cannot detach from a non-existing container: ' + containerUri);

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE
        { <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }
      `,
      webId,
      dataset
    });

    ctx.emit(
      'ldp.container.detached',
      {
        containerUri,
        resourceUri
      },
      { meta: { webId: null, dataset: null } }
    );
  }
};
