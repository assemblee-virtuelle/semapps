const jsonld = require('jsonld');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery } = require('../../../utils');

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
      query: { type: 'object', optional: true },
      queryDepth: { type: 'number', default: 0 },
      jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
    },
    async handler(ctx) {
      const { accept, containerUri, query, queryDepth, jsonContext } = ctx.params;
      let [constructQuery, whereQuery] = buildBlankNodesQuery(queryDepth);

      if (query) {
        Object.keys(query).forEach((predicate, i) => {
          if (query[predicate]) {
            whereQuery += `
              FILTER EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} "${
              query[predicate]
            }" } .
            `;
          } else {
            whereQuery += `
              FILTER NOT EXISTS { ?s1 ${predicate.startsWith('http') ? `<${predicate}>` : predicate} ?unwanted${i} } .
            `;
          }
        });
      }

      let result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT  {
            <${containerUri}>
              a ldp:BasicContainer ;
              ldp:contains ?s1 .
            ?s1 ?p1 ?o1 .
            ${constructQuery}
          }
          WHERE {
            <${containerUri}> a ldp:BasicContainer .
            OPTIONAL { 
              <${containerUri}> ldp:contains ?s1 .
              ?s1 ?p1 ?o1 .
              ${whereQuery}
            }
          }
        `,
        accept
      });

      if (accept === MIME_TYPES.JSON) {
        result = await jsonld.frame(result, {
          '@context': jsonContext || getPrefixJSON(this.settings.ontologies),
          '@id': containerUri
        });

        // Remove the @graph
        result = {
          '@context': result['@context'],
          ...result['@graph'][0]
        };

        // If the ldp:contains is a single object, wrap it in an array
        const ldpContainsKey = Object.keys(result).find(key =>
          ['http://www.w3.org/ns/ldp#contains', 'ldp:contains', 'contains'].includes(key)
        );
        if (ldpContainsKey && !Array.isArray(result[ldpContainsKey])) {
          result[ldpContainsKey] = [result[ldpContainsKey]];
        }
      }

      return result;
    }
  }
};
