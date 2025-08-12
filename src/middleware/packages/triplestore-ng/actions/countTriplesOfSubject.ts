import { defineAction } from 'moleculer';
import ng from 'nextgraph';

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
    }
  },
  async handler(ctx) {
    const { uri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore countTriplesOfSubject: ${uri}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    const query = `SELECT (COUNT(*) AS ?count) WHERE { <${uri}> ?p ?o }`;

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      const result = await ng.sparql_query(session.session_id, query);
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
      
      const parsedResult = await this.sparqlJsonParser.parseJsonResults(result);
      return parsedResult[0]?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to count triples for subject ${uri} in dataset ${dataset}:`, error);
      throw error;
    }
  }
});

export default Schema; 