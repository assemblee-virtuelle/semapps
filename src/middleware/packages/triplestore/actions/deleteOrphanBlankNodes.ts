import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
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
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;
    const { graphName } = ctx.params;

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    // Launch the query 3 times, so that blank nodes within orphan blank nodes are also deleted
    for (let i = 0; i < 3; i++) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      await this.actions.update(
        {
          query: `
          ${graphName ? `WITH <${graphName}>` : ''}
          DELETE {
            ?s ?p ?o .
          }
          WHERE {
            ?s ?p ?o .
            FILTER(isBLANK(?s))
            FILTER(NOT EXISTS {?parentS ?parentP ?s})
          }
        `,
          webId: 'system',
          dataset
        },
        { parentCtx: ctx }
      );
    }
  }
} satisfies ActionSchema;

export default Schema;
