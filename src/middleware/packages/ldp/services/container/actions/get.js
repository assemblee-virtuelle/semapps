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
      accept: { type: 'string' },
      expand: { type: 'array', optional: true },
      jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
    },
    async handler(ctx) {
      const { accept, containerUri, expand, jsonContext } = ctx.params;
      let constructOptions = '',
        whereOptions = '';

      if (expand) {
        constructOptions = `?rO ?srP ?srO .`;
        whereOptions = `
          OPTIONAL {
            ?item ?propsToExpand ?rO .
            FILTER(?propsToExpand IN (${expand.join(', ')})) .
            ?rO ?srP ?srO .
          }
        `;
      }

      const result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT  {
            <${containerUri}>
              a ldp:BasicContainer ;
              ldp:contains ?rS .
            ?rS ?rP ?rO .
            ${constructOptions}
          }
          WHERE {
            <${containerUri}>
              a ldp:BasicContainer ;
              ldp:contains ?rS .
            OPTIONAL { 
              ?rS ?rP ?rO . 
              ${whereOptions}
            }
          }
        `,
        accept
      });

      if (accept === MIME_TYPES.JSON) {
        const framedResult = await jsonld.frame(result, {
          '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
          '@id': containerUri
        });

        // Return the result without the @graph
        return {
          '@context': framedResult['@context'],
          ...framedResult['@graph'][0],
          'ldp:contains': Array.isArray(framedResult['@graph'][0]['ldp:contains'])
            ? framedResult['@graph'][0]['ldp:contains']
            : [framedResult['@graph'][0]['ldp:contains']]
        };
      } else {
        return result;
      }
    }
  }
};
