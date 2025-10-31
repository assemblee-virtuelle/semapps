import { ControlledResourceMixin } from '@semapps/ldp';
import rdf from '@rdfjs/data-model';
import { ServiceSchema } from 'moleculer';

const PublicTypeIndexService = {
  name: 'public-type-index' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    path: '/public-type-index',
    types: ['solid:TypeIndex', 'solid:ListedDocument'],
    permissions: {
      anon: {
        read: true
      }
    },
    typeIndex: 'public'
  },
  events: {
    'webid.created': {
      async handler(ctx) {
        const { resourceUri: webId } = ctx.params;
        const typeIndexUri = await this.actions.waitForCreation({}, { parentCtx: ctx });

        await ctx.call('ldp.resource.patch', {
          resourceUri: webId,
          triplesToAdd: [
            rdf.quad(
              rdf.namedNode(webId),
              rdf.namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'),
              rdf.namedNode(typeIndexUri)
            )
          ],
          webId: 'system'
        });
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
