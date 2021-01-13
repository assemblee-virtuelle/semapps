const jsonld = require('jsonld');
const { MIME_TYPES } = require('@semapps/mime-types');
const {
  getPrefixRdf,
  getPrefixJSON,
  buildBlankNodesQuery,
  buildDereferenceQuery,
  buildFiltersQuery
} = require('../../../utils');

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
      keys: ['containerUri', 'accept', 'filters', 'queryDepth', 'dereference', 'jsonContext']
    },
    async handler(ctx) {
      const { containerUri, filters, webId } = ctx.params;
      const { accept, dereference, queryDepth, jsonContext } = {
        ...(await ctx.call('ldp.getContainerOptions', { uri: containerUri })),
        ...ctx.params
      };
      const filtersQuery = buildFiltersQuery(filters);

      // Handle JSON-LD differently, because the framing (https://w3c.github.io/json-ld-framing/)
      // does not work correctly and resources are not embedded at the right place.
      // This has bad impact on performances, unless the cache is activated
      if (accept === MIME_TYPES.JSON) {
        const result = await ctx.call('triplestore.query', {
          query: `
            ${getPrefixRdf(this.settings.ontologies)}
            CONSTRUCT  {
              <${containerUri}>
                a ?containerType ;
                ldp:contains ?s1 .
            }
            WHERE {
              <${containerUri}> a ldp:Container, ?containerType .
              OPTIONAL { 
                <${containerUri}> ldp:contains ?s1 .
                ${filtersQuery.where}
              }
            }
          `,
          accept,
          webId
        });

        // Request each resources
        let resources = [];
        if( result && result.contains ) {
          for( const resourceUri of result.contains ) {
            resources.push(await ctx.call('ldp.resource.get', {
              resourceUri,
              webId,
              accept,
              queryDepth,
              dereference,
              jsonContext
            }));
          }
        }

        return jsonld.compact({
            '@id': containerUri,
            'ldp:contains': resources
          },
          jsonContext || getPrefixJSON(this.settings.ontologies)
        );
      } else {
        const blandNodeQuery = buildBlankNodesQuery(queryDepth);
        const dereferenceQuery = buildDereferenceQuery(dereference);

        return await ctx.call('triplestore.query', {
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
      }
    }
  }
};
