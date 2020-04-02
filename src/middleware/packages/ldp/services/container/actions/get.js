const { negotiateTypeMime } = require('@semapps/mime-types');
const { getPrefixRdf } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri } = ctx.params;
    const accept = ctx.meta.headers.accept;
    try {
      const body = await ctx.call('ldp.container.get', {
        containerUri,
        accept
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
      containerUri: { type: 'string' },
      accept: { type: 'string' }
    },
    async handler(ctx) {
      console.log('negotiateTypeMime(ctx.params.accept)', ctx.params.accept, negotiateTypeMime(ctx.params.accept));
      return await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT {
            ?container ldp:contains ?subject .
            ?subject ?predicate ?object .
          }
          WHERE {
            <${ctx.params.containerUri}>
                a ldp:BasicContainer ;
                ldp:contains ?subject .
            ?container ldp:contains ?subject .
            ?subject ?predicate ?object .
          }
        `,
        accept: negotiateTypeMime(ctx.params.accept)
      });
    }
  }
};
