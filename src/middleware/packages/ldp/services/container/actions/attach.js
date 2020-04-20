const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;
    const containerExists = await this.actions.exist({ containerUri });
    if (!containerExists) throw new Error('Cannot attach to a non-existing container !');

    return await ctx.call('triplestore.insert', {
      resource: {
        '@context': 'http://www.w3.org/ns/ldp',
        '@id': containerUri,
        '@type': ['Container', 'BasicContainer'],
        contains: resourceUri
      },
      contentType: MIME_TYPES.JSON
    });
  }
};
