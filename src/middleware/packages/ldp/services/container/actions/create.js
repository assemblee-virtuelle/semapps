const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('triplestore.insert', {
      resource: {
        '@context': { '@vocab': 'http://www.w3.org/ns/ldp#' },
        '@id': containerUri,
        '@type': ['Container', 'BasicContainer']
      },
      contentType: MIME_TYPES.JSON,
      webId
    });
  }
};
