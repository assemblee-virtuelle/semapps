import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    triple: {
      type: 'object'
    },
    webId: {
      type: 'string',
      optional: true
    },
    dataset: {
      type: 'string',
      optional: true
    },
    graphName: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { triple, graphName } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    return await ctx.call('triplestore.query', {
      query: {
        type: 'query',
        queryType: 'ASK',
        where: [
          graphName
            ? {
                type: 'graph',
                name: { termType: 'NamedNode', value: graphName },
                patterns: [{ type: 'bgp', triples: [triple] }]
              }
            : { type: 'bgp', triples: [triple] }
        ]
      },
      accept: MIME_TYPES.JSON,
      webId,
      dataset
    });
  }
} satisfies ActionSchema;

export default Schema;
