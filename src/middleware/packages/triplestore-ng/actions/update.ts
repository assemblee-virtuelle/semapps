import urlJoin from 'url-join';
import { defineAction } from 'moleculer';
import ng from 'nextgraph';

const Schema = defineAction({
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

    if (typeof query === 'object') query = this.generateSparqlQuery(query);

    if (!dataset) throw new Error(`No dataset defined for triplestore update: ${query}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Updating dataset ${dataset}...`);
      try {
        const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
        await ng.sparql_update(session.session_id, query);
        await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
      } catch (error) {
        this.logger.error(`Failed to update dataset ${dataset}:`, error);
        throw error;
      }
    }
  }
});

export default Schema; 