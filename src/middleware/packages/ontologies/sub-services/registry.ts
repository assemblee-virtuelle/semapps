import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema } from 'moleculer';

const OntologiesRegistrySchema = {
  name: 'ontologies.registry' as const,
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: 'settings' }),
  settings: {
    idField: '@id'
  },
  actions: {
    getByPrefix: {
      async handler(ctx) {
        const { prefix } = ctx.params;
        const [ontology] = await this._find(ctx, { query: { prefix } });
        return ontology && { prefix: ontology.prefix, namespace: ontology.namespace };
      }
    },

    getByNamespace: {
      async handler(ctx) {
        const { namespace } = ctx.params;
        const [ontology] = await this._find(ctx, { query: { namespace } });
        return ontology && { prefix: ontology.prefix, namespace: ontology.namespace };
      }
    },

    list: {
      async handler(ctx) {
        const ontologies = await this._list(ctx, {});
        return ontologies.rows.map(({ prefix, namespace }) => ({ prefix, namespace }));
      }
    },

    updateOrCreate: {
      async handler(ctx) {
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
  }
} satisfies ServiceSchema;

export default OntologiesRegistrySchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [OntologiesRegistrySchema.name]: typeof OntologiesRegistrySchema;
    }
  }
}
