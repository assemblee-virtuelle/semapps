const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    let { typeURL, containerUri } = ctx.params;
    const body = ctx.meta.body;
    const slug = ctx.meta.headers.slug;
    if (!body['@id']) {
      body['@id'] = this.generateId(typeURL, containerUri, slug);
    }
    try {
      let out = await ctx.call('ldp.post', {
        resource: body,
        contentType: ctx.meta.headers['content-type'],
        accept: MIME_TYPES.JSON
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
      webId: {
        type: 'string',
        optional: true
      },
      accept: {
        type: 'string'
      },
      contentType: {
        type: 'string'
      }
    },
    async handler(ctx) {
      let resource = ctx.params.resource;
      const accept = ctx.params.accept;
      const contentType = ctx.params.contentType;
      if (ctx.params.webId) {
        ctx.meta.webId = ctx.params.webId;
      }
      resource['@id'] = await this.findUnusedUri(ctx, resource['@id']);

      await ctx.call('triplestore.insert', {
        resource: resource,
        contentType: contentType
      });

      return await ctx.call('ldp.get', {
        resourceUri: resource['@id'],
        accept: accept
      });
    }
  }
};
