module.exports = {
  settings: {
    documentPredicates: {
      created: 'http://purl.org/dc/terms/created',
      updated: 'http://purl.org/dc/terms/modified',
      creator: 'http://purl.org/dc/terms/creator'
    }
  },
  actions: {
    async tagCreatedResource(ctx) {
      const { resourceUri, webId } = ctx.params;
      const now = new Date();

      let triples = [];
      triples.push(`<${resourceUri}> <${this.settings.documentPredicates.created}> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`);
      triples.push(`<${resourceUri}> <${this.settings.documentPredicates.updated}> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`);
      if( webId && webId.startsWith('http') ) triples.push(`<${resourceUri}> <${this.settings.documentPredicates.creator}> <${webId}> .`);

      await ctx.call('triplestore.insert', {
        resource: triples.join('\n'),
        webId: 'system'
      });
    },
    async tagUpdatedResource(ctx) {
      const { resourceUri } = ctx.params;
      const now = new Date();
      await ctx.call('triplestore.update', {
        query: `
          DELETE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
          INSERT { <${resourceUri}> <${this.settings.documentPredicates.updated}> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> }
          WHERE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
        `,
        webId: 'system'
      })
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, webId } = ctx.params;
      this.actions.tagCreatedResource(
        { resourceUri, webId },
        { parentCtx: ctx }
      );
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      this.actions.tagUpdatedResource(
        { resourceUri },
        { parentCtx: ctx }
      );
    }
  }
};
