const { triple, namedNode, variable } = require('@rdfjs/data-model');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    let exist = await ctx.call('triplestore.tripleExist', {
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      webId: 'system'
    });

    if (exist) {
      return undefined; // Default graph
    }
    exist = await ctx.call('triplestore.tripleExist', {
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      graphName: this.settings.mirrorGraphName
    });

    if (exist) {
      return this.settings.mirrorGraphName;
    }
    return false;
  }
};
