import { defineAction } from 'moleculer';

const Schema = defineAction({
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

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

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
      webId,
      dataset
    });
  }
});

export default Schema;
