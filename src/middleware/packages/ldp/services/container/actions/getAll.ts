const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          ?containerUri a ldp:Container .
        }
      `,
      accept: MIME_TYPES.JSON,
      dataset: ctx.params.dataset,
      webId: 'system'
    });

    return result.map(node => node.containerUri.value);
  }
};
