import { defineAction } from 'moleculer';
import { isURL, arrayOf } from '../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    prefix: 'string',
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    namespace: 'string',
    owl: { type: 'string', optional: true },
    jsonldContext: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
    preserveContextUri: { type: 'boolean', default: false },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
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
});

export default Schema;
