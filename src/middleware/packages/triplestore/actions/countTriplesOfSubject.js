const {MIME_TYPES} = require("@semapps/mime-types");
module.exports = {
  visibility: 'public',
  params: {
    uri: {
      type: 'string'
    },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const results = await ctx.call('triplestore.query', {
      query: `
        SELECT ?p ?v
        WHERE {
          <${ctx.params.uri}> ?p ?v
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: webId
    });
    return results.length;
  }
};
