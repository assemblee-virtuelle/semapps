import { ControlledResourceMixin, getWebIdFromUri } from '@semapps/ldp';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const PublicTypeIndexService = {
  name: 'public-type-index' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    path: 'public-type-index',
    types: ['solid:TypeIndex', 'solid:ListedDocument'],
    permissions: {
      anon: {
        read: true
      }
    },
    typeIndex: 'public'
  },
  hooks: {
    after: {
      async create(ctx, res) {
        const { resourceUri } = res;
        const webId = getWebIdFromUri(resourceUri);

        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [
            rdf.quad(
              rdf.namedNode(webId!),
              rdf.namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'),
              rdf.namedNode(resourceUri)
            )
          ],
          webId
        });

        return res;
      }
    }
  }
} satisfies ServiceSchema;

export default PublicTypeIndexService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [PublicTypeIndexService.name]: typeof PublicTypeIndexService;
    }
  }
}
