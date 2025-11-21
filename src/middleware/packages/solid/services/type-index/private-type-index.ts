import { ControlledResourceMixin } from '@semapps/ldp';
import rdf from '@rdfjs/data-model';
import { ServiceSchema, Context } from 'moleculer';

const PrivateTypeIndexService = {
  name: 'private-type-index' as const,
  mixins: [ControlledResourceMixin],
  settings: {
    path: '/private-type-index',
    types: ['solid:TypeIndex', 'solid:UnlistedDocument'],
    permissions: {},
    typeIndex: 'private',
    // Use a SPARQL query to find the resource URI.
    // This is necessary for the type indexes, otherwise we have an infinite loop
    sparqlQuery: true
  },
  events: {
    'solid-preferences-file.created': {
      async handler(ctx: Context<any>) {
        const { resourceUri: preferencesUri } = ctx.params;
        const typeIndexUri = await this.actions.waitForCreation({}, { parentCtx: ctx });

        if (preferencesUri) {
          await ctx.call('solid-preferences-file.patch', {
            resourceUri: preferencesUri,
            triplesToAdd: [
              rdf.quad(
                rdf.namedNode(preferencesUri),
                rdf.namedNode('http://www.w3.org/ns/solid/terms#privateTypeIndex'),
                rdf.namedNode(typeIndexUri)
              )
            ],
            webId: 'system'
          });
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
