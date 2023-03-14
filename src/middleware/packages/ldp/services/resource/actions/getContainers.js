const { MIME_TYPES } = require("@semapps/mime-types");
const { getContainerFromUri } = require("../../../utils");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string'
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    // In the POD provider config, the root container with actors is not a real LDP container
    // Because we have chosen not to use a common dataset for this kind of data
    // So we use the soon-deprecated getContainerFromUri to find the container
    // TODO store actors in a proper LDP container, with its own dataset ?
    // if (this.settings.podProvider && (getContainerFromUri(resourceUri) + '/' === this.settings.baseUrl)) {
    //   return [getContainerFromUri(resourceUri)];
    // }

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
