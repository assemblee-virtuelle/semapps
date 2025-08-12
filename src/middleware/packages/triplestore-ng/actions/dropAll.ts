import urlJoin from 'url-join';
import { defineAction } from 'moleculer';
import ng from 'nextgraph';

const Schema = defineAction({
  visibility: 'public',
  params: {
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;

    if (!dataset) throw new Error('No dataset defined for triplestore dropAll');
    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });
      await ng.sparql_update(session.session_id, 'DELETE { ?s ?p ?o } WHERE { ?s ?p ?o }');
      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
    } catch (error) {
      this.logger.error(`Failed to drop all data from dataset ${dataset}:`, error);
      throw error;
    }
  }
});

export default Schema; 