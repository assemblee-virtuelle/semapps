import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
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
});

export default Schema;
