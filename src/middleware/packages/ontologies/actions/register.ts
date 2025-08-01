import { isURL, arrayOf } from '../utils.ts';

const Schema = {
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
    persist: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    let { prefix, namespace, owl, jsonldContext, preserveContextUri, persist } = ctx.params;

    if (preserveContextUri === true) {
      if (!jsonldContext || !arrayOf(jsonldContext).every(context => isURL(context))) {
        throw new Error(
          `Cannot register ${prefix} ontology. If preserveContextUri is true, jsonldContext must be one or more URI`
        );
      }
    }

    if (persist) {
      if (!this.settings.persistRegistry)
        throw new Error(`Cannot persist ontology because the persistRegistry setting is false`);
      if (owl || jsonldContext) throw new Error(`The owl and jsonldContext params cannot be persisted`);

      await ctx.call('ontologies.registry.updateOrCreate', {
        prefix,
        namespace
      });

      this.ontologies[prefix] = {
        prefix,
        namespace
      };
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

export default Schema;
