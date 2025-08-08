import { SingleResourceContainerMixin } from '@semapps/ldp';
import { pim } from '@semapps/ontologies';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const SolidPreferencesFileSchema = {
  name: 'solid-preferences-file' as const,
  mixins: [SingleResourceContainerMixin],
  settings: {
    acceptedTypes: ['pim:ConfigurationFile'],
    permissions: {},
    newResourcesPermissions: {},
    excludeFromMirror: true,
    activateTombstones: false,
    podProvider: true
  },
  dependencies: ['ontologies'],
  async started() {
    await this.broker.call('ontologies.register', pim);
  },
  hooks: {
    after: {
      async post(ctx, res) {
        await ctx.call('ldp.resource.patch', {
          resourceUri: ctx.params.webId,
          triplesToAdd: [
            rdf.triple(
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
