import { MIME_TYPES } from '@semapps/mime-types';
import type { ActionSchema } from 'moleculer';

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
          <${resourceUri}> a ?type .
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: 'system'
    });

    return result.map((node: any) => node.type.value);
  }
} satisfies ActionSchema;

export default Schema;
