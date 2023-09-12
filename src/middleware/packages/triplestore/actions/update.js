const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object' }],
    },
    webId: {
      type: 'string',
      optional: true,
    },
    dataset: {
      type: 'string',
      optional: true,
    },
  },
  async handler(ctx) {
    let { query } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore update: ${query}`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (const dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Updating dataset ${dataset}...`);
      await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
        body: query,
        headers: {
          'Content-Type': 'application/sparql-update',
          'X-SemappsUser': webId,
        },
      });
    }
  },
};
