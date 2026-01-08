import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object' }]
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { query } = ctx.params;
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore update: ${query}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    // Handle wildcard
    const datasets: string[] = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Updating dataset ${dataset}...`);

      // Use backend abstraction
      await this.settings.adapter.update(dataset, query);
    }
  }
} satisfies ActionSchema;

export default Schema;
