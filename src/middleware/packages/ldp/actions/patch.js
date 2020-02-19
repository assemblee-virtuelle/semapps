const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    let { typeURL, resourceId } = ctx.params;
    const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    const body = ctx.meta.body;
    body['@id'] = resourceUri;
    try {
      await ctx.call('ldp.patch', {
        resource: body,
        accept: ctx.meta.headers.accept,
        contentType: ctx.meta.headers['content-type']
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
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      accept: { type: 'string' },
      contentType: { type: 'string' }
    },
    async handler(ctx) {
      let resource = ctx.params.resource;
      const accept = ctx.params.accept;
      const contentType = ctx.params.contentType;
      if (ctx.params.webId) {
        ctx.meta.webId = ctx.params.webId;
      }

      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resource['@id']
      });
      if (triplesNb > 0) {
        await ctx.call('triplestore.patch', {
          resource: resource,
          contentType: contentType
        });

        return await ctx.call('ldp.get', {
          resourceUri: resource['@id'],
          accept: accept
        });
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
