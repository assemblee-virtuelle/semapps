const { MoleculerError } = require('moleculer').Errors;
const jsonld = require('jsonld');
const constants = require('./../constants');

module.exports = {
  api: async function api(ctx) {
    const type = ctx.params.typeURL;
    const accept = ctx.meta.headers.accept;
    try {
      let body = await ctx.call('ldp.getByType', {
        type: type
      });
      ctx.meta.$responseType = accept;

      return body;
    } catch (e) {
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      type: { type: 'string' },
      webId: { type: 'string', optional: true },
      accept: { type: 'string', optional: true }
    },
    async handler(ctx) {
      const accept = ctx.params.accept || ctx.meta.headers.accept;
      const webId = ctx.params.webId || ctx.meta.headers.webId;
      let result = await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          CONSTRUCT {
            ?subject ?predicate ?object.
          }
          WHERE {
            ?subject rdf:type ${ctx.params.type} ;
              ?predicate ?object.
          }
              `,
        accept: 'json',
        webId: webId
      });
      result = await jsonld.compact(result, this.getPrefixJSON());
      const { '@graph': graph, '@context': context, ...other } = result;
      const contains = graph || (Object.keys(other).length === 0 ? [] : [other]);
      result = {
        '@context': result['@context'],
        '@id': `${this.settings.baseUrl}${ctx.params.typeURL}`,
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': contains
      };
      const negociatedAccept = this.negociateAccept(accept);

      if (negociatedAccept != constants.MIME_TYPE_SUPPORTED.JSON) {
        result = await this.jsonldToTriples(result, accept);
      }
      return result;
    }
  }
};
