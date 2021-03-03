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

    // setting some perms on the container.
    const webId = ctx.meta.webId || 'anon';

    let newRights = {};
    if (webId == 'anon') {
      newRights.anon = {
        read: true,
        append: true
      };
    } else if (webId == 'system') {
      newRights.anon = {
        read: true
      };
      newRights.anyUser = {
        read: true,
        write: true
      };
    } else if (webId) {
      newRights.user = {
        uri: webId,
        read: true,
        write: true,
        control: true
      };
    }

    await ctx.call('webacl.resource.addRights', {
      webId: 'system',
      resourceUri: ctx.params.containerUri,
      newRights
    });
  }
};
