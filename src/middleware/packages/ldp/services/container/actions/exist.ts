import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

<<<<<<< HEAD
    return (
      (await ctx.call('triplestore.document.exist', { documentUri: containerUri })) ||
      (await ctx.call('triplestore.document.exist', { documentUri: `${containerUri}/` }))
    );
=======
    const isRemoteContainer = await ctx.call('ldp.remote.isRemote', { resourceUri: containerUri });

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE { 
          ${isRemoteContainer ? `GRAPH <${this.settings.mirrorGraphName}> {` : ''}
          ?container a ldp:Container .
          FILTER(?container IN (<${containerUri}>, <${`${containerUri}/`}>)) .
          ${isRemoteContainer ? '}' : ''}
        }
      `,
      webId: 'system'
    });
>>>>>>> 2.0
  }
} satisfies ActionSchema;

export default Schema;
