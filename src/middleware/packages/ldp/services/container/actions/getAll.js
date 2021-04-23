const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  async handler(ctx) {
    await ctx.call('triplestore.query', {
      query: `
        ${getPrefixRdf(this.settings.ontologies)}
        SELECT ?containerUri
        WHERE {
          ?containerUri a ldp:Container .
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: 'system'
    });
  }
};
