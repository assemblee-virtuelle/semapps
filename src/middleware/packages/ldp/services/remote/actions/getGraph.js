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

    if (exist) {
      return undefined; // Default graph
    } else {
      exist = await ctx.call('triplestore.tripleExist', {
        triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
        webId,
        graphName: this.settings.mirrorGraphName
      });

      if (exist) {
        return this.settings.mirrorGraphName;
      } else {
        return false;
      }
    }
  }
};
