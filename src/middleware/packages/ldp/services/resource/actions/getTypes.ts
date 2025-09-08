import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
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
<<<<<<< HEAD
          GRAPH <${resourceUri}> {
            <${resourceUri}> a ?type .
          }
=======
          <${resourceUri}> a ?type .
>>>>>>> 2.0
        }
      `,
      webId: 'system'
    });

    return result.map((node: any) => node.type.value);
  }
} satisfies ActionSchema;

export default Schema;
