module.exports = {
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
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;
    const { graphName } = ctx.params;
    // Launch the query 3 times, so that blank nodes within orphan blank nodes are also deleted
    for (let i = 0; i < 3; i++) {
      await this.actions.update(
        {
          query: `
          ${graphName ? 'WITH <' + graphName + '>' : ''}
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
};
