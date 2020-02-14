const {MoleculerError} = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    let {
      typeURL,
      resourceId,
      ...body
    } = ctx.params;
    const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    body['@id'] = resourceUri;
    try {
      console.log(ctx.meta.headers);
      await ctx.call('ldp.patch', {
        resource: body,
        webId: ctx.meta.webId,
        accept: ctx.meta.headers.accept,
        contentType: ctx.meta.headers['content-type'],

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
      resource: 'object',
      webId: 'string',
      accept: 'string',
      contentType: 'string'
    },
    async handler(ctx) {
      let resource = ctx.params.resource;

      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resource['@id'],
        webId: ctx.params.webId
      });
      if (triplesNb > 0) {
        await ctx.call('triplestore.patch', {
          resource: resource,
          webId: ctx.params.webId,
          contentType: ctx.params.contentType
        });
        const out = await ctx.call('ldp.get', {
          resourceUri: resource['@id'],
          accept: ctx.params.accept,
          webId: ctx.params.webId
        });

        return out;
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
