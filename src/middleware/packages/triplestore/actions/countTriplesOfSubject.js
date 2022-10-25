const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    uri: {
      type: 'string'
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
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    const results = await ctx.call('triplestore.query', {
      query: `
        SELECT ?p ?v
        ${ctx.params.graphName ? 'FROM <' + ctx.params.graphName + '>' : ''}
        WHERE {
          <${ctx.params.uri}> ?p ?v
        }
      `,
      accept: MIME_TYPES.JSON,
      webId,
      dataset
    });

    return results.length;
  }
};
