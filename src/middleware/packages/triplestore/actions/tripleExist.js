const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    triple: {
      type: 'object'
    },
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    },
    graphName: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { triple, graphName } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    return await ctx.call('triplestore.query', {
      query: {
        type: 'query',
        queryType: 'ASK',
        where: [
          graphName
            ? {
                type: 'graph',
                name: { termType: 'NamedNode', value: graphName },
                patterns: [{ type: 'bgp', triples: [triple] }]
              }
            : { type: 'bgp', triples: [triple] }
        ]
      },
      accept: MIME_TYPES.JSON,
      webId,
      dataset
    });
  }
};
