module.exports = {
  api: async function api(ctx) {
    let { typeURL, resourceId, ...body } = ctx.params;
    const resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
    body['@id'] = resourceUri;
    // const triplesNb = await ctx.call('triplestore.countTripleOfSubject', { uri: resourceUri });
    try {
      let out = await ctx.call('ldp.patch', {
        body: body,
        webId: ctx.meta.webId
      });
      // ctx.meta.$responseType = ctx.meta.headers.accept;
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.log(e);
      //TODO manage code from typed Error
      ctx.meta.$statusCode = 500;
    }
  },
  action: {
    visibility: 'public',
    params: {
      // accept:'string',
      // resourceUri: 'string',
      body: 'object',
      webId: 'string'
    },
    async handler(ctx) {
      let body = ctx.params.body;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: body['@id'],
        webId: ctx.params.webId
      });
      if (triplesNb > 0) {
        const out = await ctx.call('triplestore.patch', {
          resource: body,
          webId: ctx.params.webId
        });
        return out;
      } else {
        throw new Error('resssource not found');
      }

      // const out = await ctx.call('triplestore.insert', {
      //   resource: body,
      //   accept: 'json'
      // });
      // return out;
    }
  }
};
