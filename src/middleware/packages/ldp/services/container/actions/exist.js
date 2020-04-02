const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE {
          <${ctx.params.containerUri}> a ldp:Container .
        }
      `,
      accept: MIME_TYPES.JSON
    });
  }
};
