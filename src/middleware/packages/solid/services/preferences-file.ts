import { ControlledResourceMixin } from '@semapps/ldp';
import { pim } from '@semapps/ontologies';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const SolidPreferencesFileSchema = {
  name: 'solid-preferences-file' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    types: ['pim:ConfigurationFile'],
    permissions: {}
  },
  dependencies: ['ontologies'],
  async started() {
    await this.broker.call('ontologies.register', pim);
  },
  events: {
    'webid.created': {
      async handler(ctx) {
        const { resourceUri: webId } = ctx.params;
        const preferencesUri = await this.actions.waitForCreation({}, { parentCtx: ctx });
        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [
            rdf.quad(
              rdf.namedNode(webId),
              rdf.namedNode('http://www.w3.org/ns/pim/space#preferencesFile'),
              rdf.namedNode(preferencesUri)
            )
          ],
          webId: 'system'
        });
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
