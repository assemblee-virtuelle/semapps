const { MIME_TYPES } = require('@semapps/mime-types');
const {
  getPrefixRdf,
  getPrefixJSON,
  buildBlankNodesQuery,
  buildDereferenceQuery,
  buildFiltersQuery,
  isContainer,
  defaultToArray,
  isMirror
} = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri } = ctx.params;
    const { accept, controlledActions } = {
      ...(await ctx.call('ldp.registry.getByUri', { containerUri })),
      ...ctx.meta.headers
    };
    try {
      ctx.meta.$responseType = ctx.meta.$responseType || accept;
      return await ctx.call(controlledActions.list || 'ldp.container.get', {
        containerUri,
        accept
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
      keys: ['containerUri', 'accept', 'filters', 'queryDepth', 'dereference', 'jsonContext', 'webId', '#webId']
    },
    async handler(ctx) {
      const { containerUri, filters } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const { accept, dereference, queryDepth, jsonContext } = {
        ...(await ctx.call('ldp.registry.getByUri', { containerUri })),
        ...ctx.params
      };
      const filtersQuery = buildFiltersQuery(filters);

      // Handle JSON-LD differently, because the framing (https://w3c.github.io/json-ld-framing/)
      // does not work correctly and resources are not embedded at the right place.
      // This has bad impact on performances, unless the cache is activated
      if (accept === MIME_TYPES.JSON) {
        let result = await ctx.call('triplestore.query', {
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
        if (result && result.contains) {
          for (const resourceUri of defaultToArray(result.contains)) {
            try {
              // We pass the following parameters only if they are explicit
              let explicitProperties = ['queryDepth', 'dereference', 'jsonContext', 'accept'];
              let explicitParams = explicitProperties.reduce((accumulator, currentProperty) => {
                if (ctx.params[currentProperty]) {
                  accumulator[currentProperty] = ctx.params[currentProperty];
                }
                return accumulator;
              }, {});

              let resource = await ctx.call('ldp.resource.get', {
                resourceUri,
                webId,
                forceSemantic: true,
                // We pass the following parameters only if they are explicit
                ...explicitParams
              });

              // If we have a child container, remove the ldp:contains property and add a ldp:Resource type
              // We are copying SOLID: https://github.com/assemblee-virtuelle/semapps/issues/429#issuecomment-768210074
              if (isContainer(resource)) {
                delete resource['ldp:contains'];
                resource.type = defaultToArray(resource.type);
                resource.type.push('ldp:Resource');
              }

              resources.push(resource);
            } catch (e) {
              // Ignore a resource if it is not found
              if (e.name !== 'MoleculerError') throw e;
            }
          }
        }

        result = await ctx.call('jsonld.compact', {
          input: {
            '@id': containerUri,
            '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
            'http://www.w3.org/ns/ldp#contains': resources
          },
          context: jsonContext || getPrefixJSON(this.settings.ontologies)
        });

        // If the ldp:contains is a single object, wrap it in an array for easier handling on the front side
        const ldpContainsKey = Object.keys(result).find(key =>
          ['http://www.w3.org/ns/ldp#contains', 'ldp:contains', 'contains'].includes(key)
        );
        if (ldpContainsKey && !Array.isArray(result[ldpContainsKey])) {
          result[ldpContainsKey] = [result[ldpContainsKey]];
        }

        return result;
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
