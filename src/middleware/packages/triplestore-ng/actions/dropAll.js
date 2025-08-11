const urlJoin = require('url-join');
const ng = require('nextgraph');

module.exports = {
  visibility: 'public',
  params: {
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
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.mainDataset;
    if (!dataset) throw new Error('Unable to drop all data. The parameter dataset is missing');

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    try {
      const session = await ctx.call('triplestore.dataset.openSession', { dataset }, { parentCtx: ctx });

      // Clear all triples in the default graph
      await ng.sparql_update(
        session.session_id,
        `
        DELETE {
          ?s ?p ?o
        }
        WHERE {
          ?s ?p ?o
        }
      `
      );

      await ctx.call('triplestore.dataset.closeSession', { sessionId: session.session_id }, { parentCtx: ctx });
    } catch (error) {
      this.logger.error(`Failed to drop all data from dataset ${dataset}:`, error);
      throw error;
    }

    // return await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
    //   body: 'update=CLEAR+ALL',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // });
  }
};
