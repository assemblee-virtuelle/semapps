import { SingleResourceContainerMixin } from '@semapps/ldp';
// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
import { pim } from '@semapps/ontologies';
import { namedNode, triple } from '@rdfjs/data-model';
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
            triple(
              // @ts-expect-error TS(2345): Argument of type 'NamedNode<any>' is not assignabl... Remove this comment to see the full error message
              namedNode(ctx.params.webId),
              namedNode('http://www.w3.org/ns/pim/space#preferencesFile'),
              namedNode(res)
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
