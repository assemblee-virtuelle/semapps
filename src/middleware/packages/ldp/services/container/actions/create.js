const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    await ctx.call('triplestore.insert', {
      resource: {
        '@context': 'http://www.w3.org/ns/ldp',
        '@id': ctx.params.containerUri,
        '@type': ['Container', 'BasicContainer']
      },
      contentType: MIME_TYPES.JSON
    });
  }
};
