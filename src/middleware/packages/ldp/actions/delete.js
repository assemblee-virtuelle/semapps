const { MoleculerError } = require('moleculer').Errors;
module.exports = {
  api: async function api(ctx) {
    try {
      const { typeURL, resourceId } = ctx.params;
      const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
      await ctx.call('ldp.delete', {
        resourceUri: resourceUri
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: 'string',
      webId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resourceUri;
      const webId = ctx.params.webId || (ctx.meta.headers ? ctx.meta.headers.webId : undefined);
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri
      });
      if (triplesNb > 0) {
        await ctx.call('triplestore.delete', {
          uri: resourceUri,
          webId: webId
        });
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
