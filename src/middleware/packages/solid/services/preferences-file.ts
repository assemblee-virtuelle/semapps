import { SingleResourceContainerMixin } from '@semapps/ldp';
import { pim } from '@semapps/ontologies';
import { namedNode, triple } from '@rdfjs/data-model';

const SolidPreferencesFileSchema = {
  name: 'solid-preferences-file',
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
};

export default SolidPreferencesFileSchema;
