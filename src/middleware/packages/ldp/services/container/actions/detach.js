const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    const isRemoteContainer = this.isRemoteUri(containerUri);

    if (new URL(containerUri).pathname === '/') {
      if (isRemoteContainer) return; // indeed, we never have the root container on a mirror.
      containerUri = urlJoin(containerUri, '/');
    }
    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists && isRemoteContainer) return;
    if (!containerExists) throw new Error('Cannot detach from a non-existing container: ' + containerUri);

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE
        { 
          ${isRemoteContainer ? 'GRAPH <' + this.settings.mirrorGraphName + '> {' : ''}
          <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> 
          ${isRemoteContainer ? '}' : ''}
        }
      `,
      webId,
      dataset
    });

    if (!isRemoteContainer)
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
