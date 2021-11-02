const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const result = await ctx.call('triplestore.query', {
      query: `
        ${getPrefixRdf(this.settings.ontologies)}
        SELECT ?containerUri
        WHERE {
          ?containerUri a ldp:Container .
        }
      `,
      accept: MIME_TYPES.JSON,
      dataset: ctx.params.dataset,
      webId: 'system'
    });

    return result.map(node => node.containerUri.value);
  }
};
