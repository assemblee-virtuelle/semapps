module.exports = {
  api: async function api(ctx) {
    let { typeURL, resourceId } = ctx.params;
    resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    try {
      let out = await ctx.call('ldp.delete', {
        resourceUri: resourceUri
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      //TODO manage code from typed Error
      ctx.meta.$statusCode = 500;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: 'string'
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resourceUri;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri
      });
      if (triplesNb > 0) {
        await ctx.call('triplestore.delete', {
          uri: resourceUri
        });
      } else {
        throw new Error('resssource not found');
      }
    }
  }
};
