const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const { isURL, arrayOf } = require('../utils');

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
    async list(ctx) {
      const ontologies = await this._list(ctx, {});
      return ontologies.rows.map(({ prefix, url, owl, jsonldContext, preserveContextUri }) => {
        return this.parse({ prefix, url, owl, jsonldContext, preserveContextUri });
      });
    },
    register: {
      visibility: 'public',
      params: {
        prefix: 'string',
        url: 'string',
        owl: { type: 'string', optional: true },
        jsonldContext: {
          type: 'multi',
          rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
          optional: true
        },
        preserveContextUri: { type: 'boolean', default: false },
        overwrite: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { prefix, url, owl, jsonldContext, preserveContextUri, overwrite } = ctx.params;

        const ontology = await this.actions.getByPrefix({ prefix }, { parentCtx: ctx });

        if (preserveContextUri === true) {
          if (!jsonldContext || !arrayOf(jsonldContext).every(context => isURL(context))) {
            throw new Error('If preserveContextUri is true, jsonldContext must be one or more URI');
          }
        }

        // Check that jsonldContext doesn't conflict with existing context
        if (jsonldContext) {
          const existingContext = await ctx.call('jsonld.context.get');
          // Do not use the jsonld.context.merge action to avoid object properties being overwritten
          const newContext = [].concat(existingContext, jsonldContext);
          const isValid = await ctx.call('jsonld.context.validate', { context: newContext });
          if (!isValid)
            throw new Error('The ontology JSON-LD context is in conflict with the existing JSON-LD context');
        }

        // Stringify JSON-LD context if it is not an URL
        if (typeof jsonldContext !== 'string' && !(jsonldContext instanceof String)) {
          jsonldContext = JSON.stringify(jsonldContext);
        }

        if (!overwrite && ontology) {
          throw new Error('An ontology with this prefix or URL is already registered');
        }

        if (ontology) {
          await this._update(ctx, {
            '@id': ontology['@id'],
            url,
            owl,
            jsonldContext,
            preserveContextUri
          });
        } else {
          await this._create(ctx, {
            prefix,
            url,
            owl,
            jsonldContext,
            preserveContextUri
          });
        }

        if (this.broker.cacher) {
          this.broker.cacher.clean('ontologies.**');
          this.broker.cacher.clean('jsonld.context.**');
        }
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
