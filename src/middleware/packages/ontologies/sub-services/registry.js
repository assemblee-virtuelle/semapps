const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const { isURL } = require('../utils');

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
      return this.parse(ontology);
    },
    async getByNamespace(ctx) {
      const { namespace } = ctx.params;
      const [ontology] = await this._find(ctx, { query: { namespace } });
      return this.parse(ontology);
    },
    async list(ctx) {
      const ontologies = await this._list(ctx, {});
      return ontologies.rows.map(({ prefix, namespace, owl, jsonldContext, preserveContextUri }) => {
        return this.parse({ prefix, namespace, owl, jsonldContext, preserveContextUri });
      });
    },
    async updateOrCreate(ctx) {
      let { prefix, namespace, owl, jsonldContext, preserveContextUri } = ctx.params;

      const ontology = await this.actions.getByPrefix({ prefix }, { parentCtx: ctx });

      if (!isURL(jsonldContext)) jsonldContext = JSON.stringify(jsonldContext);

      if (ontology) {
        await this._update(ctx, {
          '@id': ontology['@id'],
          namespace,
          owl,
          jsonldContext,
          preserveContextUri
        });
      } else {
        await this._create(ctx, {
          prefix,
          namespace,
          owl,
          jsonldContext,
          preserveContextUri
        });
      }
    }
  },
  methods: {
    parse(ontology) {
      // If the jsonldContext is not an URL, it is an object to be parsed
      if (ontology?.jsonldContext && !isURL(ontology.jsonldContext)) {
        ontology.jsonldContext = JSON.parse(ontology.jsonldContext);
      }

      if (ontology?.preserveContextUri === 'true') {
        ontology.preserveContextUri = true;
      } else if (ontology?.preserveContextUri === 'false') {
        ontology.preserveContextUri = false;
      }

      return ontology;
    }
  }
};
