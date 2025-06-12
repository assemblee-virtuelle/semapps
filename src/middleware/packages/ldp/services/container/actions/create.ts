const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    options: { type: 'object', optional: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri, title, description, options } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('triplestore.insert', {
      resource: {
        '@id': containerUri,
        '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
        'http://purl.org/dc/terms/title': title,
        'http://purl.org/dc/terms/description': description
      },
      contentType: MIME_TYPES.JSON,
      webId
    });

    ctx.emit('ldp.container.created', { containerUri, options, webId });
  }
};
