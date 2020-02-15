const {MoleculerError} = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    let { typeURL, resourceId, ...body } = ctx.params;
    const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    body['@id'] = resourceUri;
    try {
      console.log(ctx.meta.headers);
      await ctx.call('ldp.patch', {
        resource: body
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
      accept: { type: 'string', optional: true },
      contentType: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let resource = ctx.params.resource;
      const accept = ctx.params.accept || (ctx.meta.headers?ctx.meta.headers.accept:undefined);
      const webId = ctx.params.webId || (ctx.meta.headers?ctx.meta.headers.webId:undefined);
      const contentType = ctx.params.contentType || (ctx.meta.headers?ctx.meta.headers['content-type']:undefined);

      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resource['@id'],
        webId: ctx.params.webId
      });
      if (triplesNb > 0) {
        await ctx.call('triplestore.patch', {
          resource: resource,
          webId: webId,
          contentType: contentType
        });
        const out = await ctx.call('ldp.get', {
          resourceUri: resource['@id'],
          accept: accept,
          webId: webId
        });

        return out;
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
