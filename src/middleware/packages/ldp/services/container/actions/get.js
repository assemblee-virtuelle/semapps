const jsonld = require('jsonld');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri } = ctx.params;
    const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
    try {
      const body = await ctx.call('ldp.container.get', {
        containerUri,
        accept
      });
      ctx.meta.$responseType = accept;
      return body;
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      containerUri: { type: 'string' },
      accept: { type: 'string' }
    },
    async handler(ctx) {
      const { accept, containerUri } = ctx.params;

      const result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT
          WHERE {
            <${containerUri}>
              a ldp:BasicContainer ;
              ldp:contains ?resource .
            ?resource ?resourceP ?resourceO .
          }
        `,
        accept
      });

      if (accept === MIME_TYPES.JSON) {
        const framedResult = await jsonld.frame(result, {
          '@context': getPrefixJSON(this.settings.ontologies),
          '@type': 'ldp:BasicContainer'
        });

        // Return the result without the @graph
        return {
          '@context': framedResult['@context'],
          ...framedResult['@graph'][0]
        };
      } else {
        return result;
      }
    }
  }
};
