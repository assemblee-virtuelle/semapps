import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

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
      accept: MIME_TYPES.JSON,
      webId
    });
  }
});

export default Schema;
