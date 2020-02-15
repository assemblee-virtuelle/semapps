const { MoleculerError } = require('moleculer').Errors;
const constants = require('./../constants');

module.exports = {
  api: async function api(ctx) {
    let { typeURL, containerUri, ...body } = ctx.params;
    const slug = ctx.meta.headers.slug;
    const generatedId = this.generateId(typeURL, containerUri, slug);
    body['@id'] = generatedId;
    try {
      let out = await ctx.call('ldp.post', {
        resource: body,
        accept: constants.SUPPORTED_ACCEPT_MIME_TYPES.JSON
      });
      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: out['@id'],
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
      webId: { type: 'string', optional: true },
      accept: { type: 'string', optional: true },
      contentType: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let resource = ctx.params.resource;
      const accept = ctx.params.accept || (ctx.meta.headers ? ctx.meta.headers.accept : undefined);
      const webId = ctx.params.webId || (ctx.meta.headers ? ctx.meta.headers.webId : undefined);
      const contentType = ctx.params.contentType || (ctx.meta.headers ? ctx.meta.headers['content-type'] : undefined);
      resource['@id'] = await this.findUnusedUri(ctx, resource['@id']);

      await ctx.call('triplestore.insert', {
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
    }
  }
};
