import { ControlledResourceMixin } from '@semapps/ldp';
import { pim } from '@semapps/ontologies';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const SolidPreferencesFileSchema = {
  name: 'solid-preferences-file' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    initialValue: {
      type: 'pim:ConfigurationFile'
    },
    permissions: {}
  },
  dependencies: ['ontologies'],
  async started() {
    await this.broker.call('ontologies.register', pim);
  },
  hooks: {
    after: {
      async create(ctx, res) {
        await ctx.call('ldp.resource.patch', {
          resourceUri: ctx.params.webId,
          triplesToAdd: [
            rdf.quad(
              rdf.namedNode(ctx.params.webId),
              rdf.namedNode('http://www.w3.org/ns/pim/space#preferencesFile'),
              rdf.namedNode(res)
            )
          ],
          webId: 'system'
        });
        return res;
      }
    }
  }
} satisfies ServiceSchema;

export default SolidPreferencesFileSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidPreferencesFileSchema.name]: typeof SolidPreferencesFileSchema;
    }
  }
}
