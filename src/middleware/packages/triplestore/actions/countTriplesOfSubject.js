const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    uri: {
      type: 'string'
    },
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    const results = await this.actions.query(
      {
        query: `
          SELECT ?p ?v
          WHERE {
            <${ctx.params.uri}> ?p ?v
          }
        `,
        accept: MIME_TYPES.JSON,
        webId,
        dataset
      },
      { parentCtx: ctx }
    );

    return results.length;
  }
};
