const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');
    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE {
          ?container a ldp:Container .
          FILTER(?container IN (<${containerUri}>, <${containerUri + '/'}>)) .
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: 'system'
    });
  }
};
