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
    }
  },
  async handler(ctx) {
    const { webId, dataset } = ctx.params;

    const results = await ctx.call('triplestore.query', {
      query: `
        SELECT ?p ?v
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
