const { MIME_TYPES } = require('@semapps/mime-types');
const { getContainerFromUri } = require("../../../utils");

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
        '@context': 'http://www.w3.org/ns/ldp',
        '@id': containerUri,
        '@type': ['Container', 'BasicContainer']
      },
      contentType: MIME_TYPES.JSON,
      webId
    });

    // Attach to parent container, if it exists
    const parentContainerUri = getContainerFromUri(containerUri);
    const parentContainerExist = await ctx.call('ldp.container.exist', { containerUri: parentContainerUri });
    if( parentContainerExist ) {
      await ctx.call('ldp.container.attach', {
        containerUri: parentContainerUri,
        resourceUri: containerUri
      })
    }
  }
};
