const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');

module.exports = {
  name: 'ontologies.registry',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: 'settings' }),
  settings: {
    idField: '@id'
  },
  actions: {
    async getByPrefix(ctx) {
      const { prefix } = ctx.params;
      const [ontology] = await this._find(ctx, { query: { prefix } });
      return ontology && { prefix: ontology.prefix, namespace: ontology.namespace };
    },
    async getByNamespace(ctx) {
      const { namespace } = ctx.params;
      const [ontology] = await this._find(ctx, { query: { namespace } });
      return ontology && { prefix: ontology.prefix, namespace: ontology.namespace };
    },
    async list(ctx) {
      const ontologies = await this._list(ctx, {});
      return ontologies.rows.map(({ prefix, namespace }) => ({ prefix, namespace }));
    },
    async updateOrCreate(ctx) {
      const { prefix, namespace } = ctx.params;

      const ontology = await this.actions.getByPrefix({ prefix }, { parentCtx: ctx });

      if (ontology) {
        await this._update(ctx, {
          '@id': ontology['@id'],
          namespace
        });
      } else {
        await this._create(ctx, {
          prefix,
          namespace
        });
      }
    }
  }
};
