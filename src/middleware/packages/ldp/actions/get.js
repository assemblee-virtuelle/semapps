const { MoleculerError } = require('moleculer').Errors;
module.exports = {
  api: async function api(ctx) {
    const resourceUri = `${this.settings.baseUrl}${ctx.params.typeURL}/${ctx.params.resourceId}`;
    const accept = ctx.meta.headers.accept;
    try {
      const body = await ctx.call('ldp.get', {
        resourceUri: resourceUri
      });
      ctx.meta.$responseType = accept;
      return body;
    } catch (e) {
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: 'string',
      webId: { type: 'string', optional: true },
      accept: { type: 'string', optional: true }
    },
    async handler(ctx) {
      const resourceUri = ctx.params.resourceUri;
      const accept = ctx.params.accept || (ctx.meta.headers ? ctx.meta.headers.accept : undefined);
      const webId = ctx.params.webId || (ctx.meta.headers ? ctx.meta.headers.webId : undefined);
      const tripleStoreAccept = this.getTripleStoreAccept(accept);
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri,
        webId: ctx.params.webId
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
          accept: tripleStoreAccept
        });
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
