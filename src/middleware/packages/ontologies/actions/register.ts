import { defineAction } from 'moleculer';
import { isURL, arrayOf } from '../utils.ts';

// @ts-expect-error TS(2769): No overload matches this call.
const Schema = defineAction({
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
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      if (!this.settings.persistRegistry)
        throw new Error(`Cannot persist ontology because the persistRegistry setting is false`);
      if (owl || jsonldContext) throw new Error(`The owl and jsonldContext params cannot be persisted`);

      await ctx.call('ontologies.registry.updateOrCreate', {
        prefix,
        namespace
      });

      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.ontologies[prefix] = {
        prefix,
        namespace
      };
    } else {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.ontologies[prefix] = {
        prefix,
        namespace,
        owl,
        jsonldContext,
        preserveContextUri
      };
    }

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (this.broker.cacher) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.broker.cacher.clean('ontologies.**');
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.broker.cacher.clean('jsonld.context.**');
    }

    ctx.emit('ontologies.registered', { prefix, namespace, owl, jsonldContext, preserveContextUri });
  }
});

export default Schema;
