import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');
    const childUri = ctx.params.resourceUri.replace(/\/+$/, '');

    const isRemoteContainer = await ctx.call('ldp.remote.isRemote', { resourceUri: containerUri });

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE { 
          ${isRemoteContainer ? `GRAPH <${this.settings.mirrorGraphName}> {` : ''}
          ?container ldp:contains ?child .
          FILTER(?container IN (<${containerUri}>, <${`${containerUri}/`}>)) .
          FILTER(?child IN (<${childUri}>, <${`${childUri}/`}>)) .
          ${isRemoteContainer ? '}' : ''}
        }
      `,
      webId
    });
  }
});

export default Schema;
