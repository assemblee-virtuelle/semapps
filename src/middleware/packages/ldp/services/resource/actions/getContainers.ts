import { ActionSchema } from 'moleculer';

const GetContainersAction = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          GRAPH ?g {
            ?containerUri ldp:contains <${resourceUri}> .
          }
        }
      `,
      dataset,
      webId: 'system'
    });

    return result.map((node: any) => node.containerUri.value);
  }
} satisfies ActionSchema;

export default GetContainersAction;
