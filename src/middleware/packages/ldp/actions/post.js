module.exports = {
  api: async function api(ctx) {
    let {
      typeURL,
      containerUri,
      ...body
    } = ctx.params;
    const slug = ctx.meta.headers.slug;
    const generatedId = this.generateId(typeURL, containerUri, slug);
    body['@id'] = generatedId;
    try {
      let out = await ctx.call('ldp.post', {
        resource: body,
        webId: ctx.meta.webId
      });
      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: out['@id'],
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
      resource['@id'] = await this.findUnusedUri(ctx, resource['@id']);

      await ctx.call('triplestore.insert', {
        resource: resource,
        webId: ctx.params.webId
      });

      const out = await ctx.call('ldp.get', {
        resourceUri: resource['@id'],
        accept: 'application/ld+json',
        webId: ctx.params.webId
      });

      return out;
    }
  }
};
