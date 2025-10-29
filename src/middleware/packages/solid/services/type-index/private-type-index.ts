import { ControlledResourceMixin } from '@semapps/ldp';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const PrivateTypeIndexService = {
  name: 'private-type-index' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    slug: 'private-type-index',
    initialValue: {
      '@type': ['solid:TypeIndex', 'solid:UnlistedDocument']
    },
    permissions: {},
    typeIndex: 'private'
  },
  hooks: {
    after: {
      async create(ctx, res) {
        const { webId } = ctx.params;
        const resourceUri = res;

        // Attach to preferences file, if available
        const services = await ctx.call<ServiceSchema[]>('$node.services');
        if (services.some(s => s.name === 'solid-preferences-file')) {
          const preferencesUri: string = await ctx.call('solid-preferences-file.getUri', { webId });
          if (preferencesUri) {
            await ctx.call('solid-preferences-file.patch', {
              triplesToAdd: [
                rdf.quad(
                  rdf.namedNode(preferencesUri),
                  rdf.namedNode('http://www.w3.org/ns/solid/terms#privateTypeIndex'),
                  rdf.namedNode(resourceUri)
                )
              ],
              webId
            });
          }
        }

        return res;
      }
    }
  }
} satisfies ServiceSchema;

export default PrivateTypeIndexService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PrivateTypeIndexService.name]: typeof PrivateTypeIndexService;
    }
  }
}
