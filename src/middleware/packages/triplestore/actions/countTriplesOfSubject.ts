import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    uri: {
      type: 'string'
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
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    const results = await ctx.call('triplestore.query', {
      query: `
        SELECT ?p ?v
        ${ctx.params.graphName ? `FROM <${ctx.params.graphName}>` : ''}
        WHERE {
          <${ctx.params.uri}> ?p ?v
        }
      `,
      accept: MIME_TYPES.JSON,
      webId,
      dataset
    });

    return results.length;
  }
});

export default Schema;
