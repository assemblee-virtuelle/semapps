const { triple, namedNode, variable } = require('@rdfjs/data-model');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    let exist = await ctx.call('triplestore.tripleExist', {
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      webId
    });

    // If this is a remote URI and the resource is not found in default graph, also look in mirror graph
    if (!exist && this.isRemoteUri(resourceUri, webId)) {
      exist = await ctx.call('triplestore.tripleExist', {
        triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
        webId,
        graphName: this.settings.mirrorGraphName
      });
    }

    return exist;
  }
};
