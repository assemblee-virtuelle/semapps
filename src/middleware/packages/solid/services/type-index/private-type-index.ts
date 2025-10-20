import { ControlledResourceMixin, isWebId } from '@semapps/ldp';
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
    permissions: {}
  },
  hooks: {
    after: {
      async create(ctx, res) {
        const { webId } = ctx.params;
        const resourceUri = res;

        if (isWebId(webId)) {
          await this.broker.waitForServices('solid-preferences-file');
          const preferencesUri = await ctx.call('solid-preferences-file.getUri', { webId });

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
