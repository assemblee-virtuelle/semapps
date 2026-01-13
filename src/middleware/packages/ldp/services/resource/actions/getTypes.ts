import { ActionSchema } from 'moleculer';
import { getSlugFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: 'string'
  },
  cache: {
    keys: ['resourceUri']
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const result = await ctx.call('triplestore.query', {
      query: `
        SELECT ?type
        WHERE {
          GRAPH <${getSlugFromUri(resourceUri)}> {
            <${resourceUri}> a ?type .
          }
        }
      `,
      webId: 'system'
    });

    return result.map((node: any) => node.type.value);
  }
} satisfies ActionSchema;

export default Schema;
