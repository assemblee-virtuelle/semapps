import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE {
          FILTER(?containerUri IN (<${containerUri}>, <${`${containerUri}/`}>)) .
          GRAPH ?containerUri {
            ?containerUri a ldp:Container .
          }
        }
      `,
      webId: 'system'
    });
  }
} satisfies ActionSchema;

export default Schema;
