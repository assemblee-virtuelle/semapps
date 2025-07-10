const urlJoin = require('url-join');

module.exports = {
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object' }]
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
    let { query } = ctx.params;
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore update: ${query}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Updating dataset ${dataset}...`);
      await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
        body: query,
        headers: {
          'Content-Type': 'application/sparql-update',
        }
      });
    }
  }
};
