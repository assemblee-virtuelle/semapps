import { ActionSchema } from 'moleculer';
import { getSlugFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;

    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?resourceUri
        WHERE {
          GRAPH <${getSlugFromUri(containerUri)}> {
            <${containerUri}> ldp:contains ?resourceUri .
          }
        }
      `,
      webId: 'system'
    });

    return result.map((node: any) => node.resourceUri.value);
  }
} satisfies ActionSchema;

export default Schema;
