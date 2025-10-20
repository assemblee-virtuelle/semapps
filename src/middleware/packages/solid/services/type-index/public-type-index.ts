import { ControlledResourceMixin, isWebId } from '@semapps/ldp';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const PublicTypeIndexService = {
  name: 'public-type-index' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    slug: 'public-type-index',
    initialValue: {
      '@type': ['solid:TypeIndex', 'solid:ListedDocument']
    },
    permissions: {
      anon: {
        read: true
      }
    }
  },
  hooks: {
    after: {
      async create(ctx, res) {
        const { webId } = ctx.params;
        const resourceUri = res;

        if (isWebId(webId)) {
          await ctx.call('ldp.resource.patch', {
            resourceUri: webId,
            triplesToAdd: [
              rdf.quad(
                rdf.namedNode(webId),
                rdf.namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'),
                rdf.namedNode(resourceUri)
              )
            ],
            webId
          });
        }
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
