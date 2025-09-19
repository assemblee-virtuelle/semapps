import { MIME_TYPES, negotiateType } from '@semapps/mime-types';
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
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore query: ${query}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    // Use backend implementation
    return await this.settings.adapter.query(dataset, query);
  }
} satisfies ActionSchema;

export default Schema;
