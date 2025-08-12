import urlJoin from 'url-join';
import { defineAction } from 'moleculer';
import { MIME_TYPES } from '@semapps/mime-types';
import ng from 'nextgraph';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    resource: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object', params: {} }]
    },
    graphName: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { resource, graphName } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    let dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    const rdf = await ctx.call('jsonld.parser.toRDF', {
            input: resource,
            options: {
              format: 'application/n-quads'
            }
          });

    if (!dataset) throw new Error(`No dataset defined for triplestore insert: ${rdf}`);
    if (dataset !== '*' && !(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // Handle wildcard
    const datasets = dataset === '*' ? await ctx.call('triplestore.dataset.list') : [dataset];

    for (dataset of datasets) {
      if (datasets.length > 1) this.logger.info(`Inserting into dataset ${dataset}...`);
      try {
        const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
        await ng.sparql_update(
          session.session_id,
          `INSERT DATA ${graphName ? ` { GRAPH <${graphName}>` : ''} { ${rdf} } ${graphName ? '}' : ''}`
        );
        await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
      } catch (error) {
        this.logger.error(`Failed to insert data into dataset ${dataset}:`, error);
        throw error;
      }
    }
  }
});

export default Schema; 