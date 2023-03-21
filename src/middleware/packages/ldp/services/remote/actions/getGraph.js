const { triple, namedNode, variable } = require('@rdfjs/data-model');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    let exist = await ctx.call('triplestore.tripleExist', {
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      dataset,
      webId: 'system'
    });

    if (exist) {
      return undefined; // Default graph
    } else {
      exist = await ctx.call('triplestore.tripleExist', {
        triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
        dataset,
        graphName: this.settings.mirrorGraphName,
      });

      if (exist) {
        return this.settings.mirrorGraphName;
      } else {
        return false;
      }
    }
  }
};
