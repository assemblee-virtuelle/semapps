import { defineAction } from 'moleculer';

const Schema = defineAction({
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
      dataset: ctx.params.dataset,
      webId: 'system'
    });

    return result.map(node => node.containerUri.value);
  }
});

export default Schema;
