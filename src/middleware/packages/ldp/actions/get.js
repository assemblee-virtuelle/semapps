module.exports = {
  api: async function api(ctx) {
    const resourceUri = `${this.settings.baseUrl}${ctx.params.typeURL}/${ctx.params.resourceId}`;
    const accept = ctx.meta.headers.accept;
    try {
      const body = await ctx.call('ldp.get', {
        resourceUri: resourceUri,
        accept: accept,
        webId: ctx.meta.webId || 'system'
      });
      ctx.meta.$responseType = accept;
      return body;
    } catch (e) {
      //TODO manage code from typed Error
      ctx.meta.$statusCode = 404;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: 'string',
      accept: 'string',
      webId: 'string'
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resourceUri;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri,
        webId: ctx.meta.webId
      });
      if (triplesNb > 0) {
        return await ctx.call('triplestore.query', {
          query: `
              ${this.getPrefixRdf()}
              CONSTRUCT
              WHERE {
                <${resourceUri}> ?predicate ?object.
              }
                  `,
          accept: this.getAcceptHeader(ctx.params.accept)
        });
      } else {
        throw new Error('resssource not found');
      }
    }
  }
};
