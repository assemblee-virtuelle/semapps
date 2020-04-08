const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    const { typeURL, id, containerUri } = ctx.params;
    const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${id}`;
    const body = ctx.meta.body;
    body['@id'] = resourceUri;
    try {
      await ctx.call('ldp.resource.patch', {
        resource: body,
        contentType: ctx.meta.headers['content-type']
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      contentType: { type: 'string' }
    },
    async handler(ctx) {
      const { resource, contentType, webId } = ctx.params;

      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resource['@id']
      });

      if (triplesNb > 0) {
        await ctx.call('triplestore.patch', {
          resource,
          contentType,
          webId
        });

        return resource['@id'];
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
