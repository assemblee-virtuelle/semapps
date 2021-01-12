const jsonld = require('jsonld');
const { MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixRdf, getPrefixJSON, buildBlankNodesQuery, buildDereferenceQuery, buildFiltersQuery } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri } = ctx.params;
    const { accept } = { ...(await ctx.call('ldp.getContainerOptions', { uri: containerUri })), ...ctx.meta.headers };
    try {
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return await ctx.call('ldp.container.get', {
        containerUri,
        accept,
        webId: ctx.meta.webId
      });
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      containerUri: { type: 'string', optional: true },
      webId: { type: 'string', optional: true },
      accept: { type: 'string', optional: true },
      filters: { type: 'object', optional: true },
      queryDepth: { type: 'number', optional: true },
      dereference: { type: 'array', optional: true },
      jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
    },
    cache: {
      keys: ['containerUri', 'accept', 'queryDepth', 'query', 'jsonContext']
    },
    async handler(ctx) {
      const { containerUri, filters, webId } = ctx.params;
      const { accept, dereference, queryDepth, jsonContext } = {
        ...(await ctx.call('ldp.getContainerOptions', { uri: containerUri })),
        ...ctx.params
      };

      const blandNodeQuery = buildBlankNodesQuery(queryDepth);
      const dereferenceQuery = buildDereferenceQuery(dereference);
      const filtersQuery = buildFiltersQuery(filters);

      let result = await ctx.call('triplestore.query', {
        query: `
          ${getPrefixRdf(this.settings.ontologies)}
          CONSTRUCT  {
            <${containerUri}>
              a ?containerType ;
              ldp:contains ?s1 .
            ?s1 ?p1 ?o1 .
            ${blandNodeQuery.construct}
            ${dereferenceQuery.construct}
          }
          WHERE {
            <${containerUri}> a ldp:Container, ?containerType .
            OPTIONAL { 
              <${containerUri}> ldp:contains ?s1 .
              ?s1 ?p1 ?o1 .
              ${blandNodeQuery.where}
              ${dereferenceQuery.where}
              ${filtersQuery.where}
            }
          }
        `,
        accept,
        webId
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
