const { MIME_TYPES } = require('@semapps/mime-types');
const { isMirror } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

    const mirror = isMirror(containerUri,this.settings.baseUrl)

    return await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        ASK
        WHERE { 
          ${ mirror? 'GRAPH <'+this.settings.mirrorGraphName+'> {' : ''}
          ?container a ldp:Container .
          FILTER(?container IN (<${containerUri}>, <${containerUri + '/'}>)) .
          ${ mirror? '}' : ''}
        }
      `,
      accept: MIME_TYPES.JSON,
      webId
    });
  }
};
