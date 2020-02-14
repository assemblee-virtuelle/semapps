const MoleculerWebError = require('moleculer-web').Errors;
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  api: async function api(ctx) {
    let { typeURL, resourceId, ...body } = ctx.params;
    const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    body['@id'] = resourceUri;
    try {
      await ctx.call('ldp.patch', {
        resource: body,
        webId: ctx.meta.webId
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      ctx.meta.$statusCode =e.code || 500;
      ctx.meta.$statusMessage=e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: 'object',
      webId: 'string'
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
          webId: ctx.params.webId
        });

        const out = await ctx.call('ldp.get', {
          resourceUri: resource['@id'],
          accept: 'application/ld+json',
          webId: ctx.params.webId
        });

        return out;
      } else {
        throw new MoleculerError("Not found", 404, "NOT_FOUND");
      }
    }
  }
};
