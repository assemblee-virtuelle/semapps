import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    query: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
      rules: [{ type: 'string' }, { type: 'object' }]
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { query } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore update: ${query}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      if (datasets.length > 1) this.logger.info(`Updating dataset ${dataset}...`);

      // Use backend abstraction
      await this.settings.adapter.update(dataset, query);
    }
  }
} satisfies ActionSchema;

export default Schema;
