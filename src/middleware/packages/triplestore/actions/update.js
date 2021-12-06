const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    query: {
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
    const { query } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if( !dataset ) throw new Error('No dataset defined for triplestore update: ' + query);

    return await this.fetch(urlJoin(this.settings.sparqlEndpoint, dataset, 'update'), {
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update',
        'X-SemappsUser': webId
      }
    });
  }
};
