const { negotiateTypeMime } = require('@semapps/mime-types');
const { getPrefixRdf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    accept: { type: 'string' }
  },
  async handler(ctx) {
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
};