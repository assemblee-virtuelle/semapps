import { defineAction } from 'moleculer';
import ng from 'nextgraph';

const Schema = defineAction({
  visibility: 'public',
  params: {
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
    const { graphName } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error('No dataset defined for triplestore deleteOrphanBlankNodes');
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    const graphClause = graphName ? `GRAPH <${graphName}>` : '';
    const query = `
      DELETE {
        ${graphClause} { ?blankNode ?p ?o }
      }
      WHERE {
        ${graphClause} {
          ?blankNode ?p ?o .
          FILTER(isBlank(?blankNode)) .
          FILTER NOT EXISTS {
            ${graphClause} { ?s ?p2 ?blankNode }
          }
        }
      }
    `;

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      await ng.sparql_update(session.session_id, query);
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
    } catch (error) {
      this.logger.error(`Failed to delete orphan blank nodes in dataset ${dataset}:`, error);
      throw error;
    }
  }
});

export default Schema; 