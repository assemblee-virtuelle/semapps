const { v4: uuidv4 } = require('uuid');

/** @type {import('moleculer').ServiceSchema} */
const DocumentService = {
  name: 'triplestore.document',
  actions: {
    async create(ctx) {
      // TODO Do not allow to pass the document URI on creation
      let { documentUri } = ctx.params;
      if (!documentUri) uuidv4();

      if (await this.actions.exist({ documentUri }, { parentCtx: ctx })) {
        throw new Error(`Cannot create document as it already exists`);
      }

      await ctx.call('triplestore.update', {
        query: `INSERT DATA { GRAPH <${documentUri}> {} }`,
        webId: 'system'
      });

      return documentUri;
    },
    async exist(ctx) {
      const { documentUri } = ctx.params;

      return await ctx.call('triplestore.query', {
        query: `ASK { GRAPH <${documentUri}> {} }`,
        webId: 'system'
      });
    },
    async delete(ctx) {
      const { documentUri } = ctx.params;

      // We need to manually drop the graph, otherwise Fuseki will consider it still exists
      await ctx.call('triplestore.update', {
        query: `DROP GRAPH <${documentUri}>`,
        webId: 'system'
      });
    }
  }
};

module.exports = DocumentService;
