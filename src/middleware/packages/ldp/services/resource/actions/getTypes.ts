import type { ActionSchema } from 'moleculer';
import type { IBindings } from 'sparqljson-parse';
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

    if (await ctx.call('ldp.binary.isBinary', { resourceUri })) {
      const binaryRdf: any = await ctx.call('ldp.binary.getRdf', { resourceUri });

      return binaryRdf.type;
    } else {
      const result: IBindings[] = await ctx.call('triplestore.query', {
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

      return result.map(node => node.type.value);
    }
  }
} satisfies ActionSchema;

export default Schema;
