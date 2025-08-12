import { defineAction } from 'moleculer';
import ng from 'nextgraph';

const Schema = defineAction({
  visibility: 'public',
  params: {
    subject: {
      type: 'string'
    },
    predicate: {
      type: 'string'
    },
    object: {
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
    const { subject, predicate, object } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error(`No dataset defined for triplestore tripleExist: ${subject} ${predicate} ${object}`);
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    const query = `ASK WHERE { <${subject}> <${predicate}> <${object}> }`;

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      const result = await ng.sparql_query(session.session_id, query);
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to check triple existence in dataset ${dataset}:`, error);
      throw error;
    }
  }
});

export default Schema; 