import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

const Schema = defineAction({
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
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
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
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
        body: query,
        headers: {
          'Content-Type': 'application/sparql-update',
          'X-SemappsUser': webId
        }
      });
    }
  }
});

export default Schema;
