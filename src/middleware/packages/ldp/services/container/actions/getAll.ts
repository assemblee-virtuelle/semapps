import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          ?containerUri a ldp:Container .
        }
      `,
      accept: MIME_TYPES.JSON,
      dataset: ctx.params.dataset,
      webId: 'system'
    });

    return result.map((node: any) => node.containerUri.value);
  }
} satisfies ActionSchema;

export default Schema;
