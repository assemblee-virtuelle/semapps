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
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore query: ${query}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    return await this.settings.adapter.query(dataset, query);
  }
} satisfies ActionSchema;

export default Schema;
