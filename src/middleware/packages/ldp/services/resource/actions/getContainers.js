const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string'
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          ?containerUri ldp:contains <${resourceUri}> .
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: 'system'
    });

    return result.map(node => node.containerUri.value);
  }
};
