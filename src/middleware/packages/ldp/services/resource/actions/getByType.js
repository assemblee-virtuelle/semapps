const jsonld = require('jsonld');
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const type = ctx.params.typeURL;
    const accept = ctx.meta.headers.accept || this.settings.defaultAccept;
    try {
      let body = await ctx.call('ldp.resource.getByType', {
        type,
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
      type: { type: 'string' },
      webId: { type: 'string', optional: true },
      accept: { type: 'string' }
    },
    async handler(ctx) {
      const { accept, webId} = ctx.params;
      let result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT {
            ?subject ?predicate ?object.
          }
          WHERE {
            ?subject rdf:type ${ctx.params.type} ;
              ?predicate ?object.
          }
        `,
        accept: MIME_TYPES.JSON
      });
      result = await jsonld.compact(result, getPrefixJSON(this.settings.ontologies));
      const { '@graph': graph, '@context': context, ...other } = result;
      const contains = graph || (Object.keys(other).length === 0 ? [] : [other]);
      result = {
        '@context': result['@context'],
        '@id': `${this.settings.baseUrl}${ctx.params.typeURL}`,
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': contains
      };
      const negotiatedAccept = negotiateTypeMime(accept);

      if (negotiatedAccept !== MIME_TYPES.JSON) {
        result = await this.jsonldToTriples(result, accept);
      }
      return result;
    }
  }
};
