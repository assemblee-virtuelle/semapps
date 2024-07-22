const { isURL, arrayOf } = require('../utils');

module.exports = {
  visibility: 'public',
  params: {
    prefix: 'string',
    namespace: 'string',
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
    let { prefix, namespace, owl, jsonldContext, preserveContextUri, overwrite } = ctx.params;

    const ontology = await this.actions.get({ prefix }, { parentCtx: ctx });

    if (!overwrite && ontology) {
      throw new Error(`Cannot register ${prefix} ontology. An ontology with the prefix is already registered`);
    }

    if (preserveContextUri === true) {
      if (!jsonldContext || !arrayOf(jsonldContext).every(context => isURL(context))) {
        throw new Error(
          `Cannot register ${prefix} ontology. If preserveContextUri is true, jsonldContext must be one or more URI`
        );
      }
    }

    if (this.settings.persistRegistry) {
      await ctx.call('ontologies.registry.updateOrCreate', {
        prefix,
        namespace,
        owl,
        jsonldContext,
        preserveContextUri
      });
    } else {
      this.ontologies[prefix] = {
        prefix,
        namespace,
        owl,
        jsonldContext,
        preserveContextUri
      };
    }

    if (this.broker.cacher) {
      this.broker.cacher.clean('ontologies.**');
      this.broker.cacher.clean('jsonld.context.**');
    }

    ctx.emit('ontologies.registered', { prefix, namespace, owl, jsonldContext, preserveContextUri });
  }
};
