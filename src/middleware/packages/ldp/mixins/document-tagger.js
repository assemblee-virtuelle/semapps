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
      const { resourceUri, newData, webId } = ctx.params;
      const now = new Date();
      let triples = [];

      if (!newData['dc:created']) {
        triples.push(
          `<${resourceUri}> <${
            this.settings.documentPredicates.created
          }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
        );
      }

      if (!newData['dc:modified']) {
        triples.push(
          `<${resourceUri}> <${
            this.settings.documentPredicates.updated
          }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
        );
      }

      if (!newData['dc:creator'] && webId && webId.startsWith('http')) {
        triples.push(`<${resourceUri}> <${this.settings.documentPredicates.creator}> <${webId}> .`);
      }

      if (triples.length > 0) {
        await ctx.call('triplestore.insert', {
          resource: triples.join('\n'),
          webId: 'system'
        });
      }
    },
    async tagUpdatedResource(ctx) {
      const { resourceUri } = ctx.params;
      const now = new Date();
      await ctx.call('triplestore.update', {
        query: `
          DELETE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
          INSERT { <${resourceUri}> <${
          this.settings.documentPredicates.updated
        }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> }
          WHERE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
        `,
        webId: 'system'
      });
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId } = ctx.params;
      this.actions.tagCreatedResource({ resourceUri, newData, webId }, { parentCtx: ctx });
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      this.actions.tagUpdatedResource({ resourceUri }, { parentCtx: ctx });
    }
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider) {
          // If we have a pod provider, guess the dataset from the URI
          const containerPath = new URL(ctx.params.resourceUri).pathname;
          const parts = containerPath.split('/');
          if (parts.length > 1) {
            ctx.meta.dataset = parts[1];
          }
        }
      }
    }
  }
};
