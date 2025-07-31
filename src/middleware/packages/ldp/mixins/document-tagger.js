const { dc } = require('@semapps/ontologies');
const { getDatasetFromUri } = require('../utils');

module.exports = {
  settings: {
    documentPredicates: {
      created: 'http://purl.org/dc/terms/created',
      updated: 'http://purl.org/dc/terms/modified',
      creator: 'http://purl.org/dc/terms/creator'
    }
  },
  async started() {
    await this.broker.call('ontologies.register', dc);
  },
  actions: {
    async tagCreatedResource(ctx) {
      const { resourceUri, newData, webId, dataset } = ctx.params;
      const now = new Date();
      const triples = [];

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
        await ctx.call('triplestore.update', {
          query: `INSERT DATA { ${triples.join('\n')} }`,
          dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
          webId: 'system'
        });
      }
    },
    async tagUpdatedResource(ctx) {
      const { resourceUri, dataset } = ctx.params;
      const now = new Date();
      await ctx.call('triplestore.update', {
        query: `
          DELETE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
          INSERT { <${resourceUri}> <${
            this.settings.documentPredicates.updated
          }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> }
          WHERE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
        `,
        dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
        webId: 'system'
      });
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId, dataset } = ctx.params;
      this.actions.tagCreatedResource(
        { resourceUri, newData, webId: ctx.meta.impersonatedUser || webId, dataset },
        { parentCtx: ctx }
      );
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
    }
  }
};
