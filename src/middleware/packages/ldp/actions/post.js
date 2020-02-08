module.exports = {
  api: async function api(ctx) {
    let { typeURL, containerUri, ...body } = ctx.params;
    slug = ctx.meta.headers.slug;
    const generatedId = this.generateId(typeURL, containerUri, slug);
    body['@id'] = generatedId;
    try {
      let out = await ctx.call('ldp.post', {
        body: body,
        webId: ctx.meta.webId
      });
      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: body['@id'],
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      //TODO manage code from typed Errors
      ctx.meta.$statusCode = 500;
    }
  },
  action: {
    visibility: 'public',
    params: {
      body: 'object',
      webId:'string'
    },
    async handler(ctx) {
      let body = ctx.params.body;
      body['@id'] = await this.findUnusedUri(ctx, body['@id']);
      const out = await ctx.call('triplestore.insert', {
        resource: body,
        accept: 'json',
        webId: ctx.meta.webId
      });
      return body['@id'];
    }
  }
};
