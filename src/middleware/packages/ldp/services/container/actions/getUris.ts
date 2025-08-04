import { MIME_TYPES } from '@semapps/mime-types';

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
          <${containerUri}> ldp:contains ?resourceUri .
        }
      `,
      accept: MIME_TYPES.JSON,
      webId: 'system'
    });

    return result.map(node => node.resourceUri.value);
  }
};

export default Schema;
