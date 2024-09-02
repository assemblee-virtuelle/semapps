const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;
const { buildBlankNodesQuery, buildFiltersQuery, isContainer, cleanUndefined, arrayOf } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    filters: { type: 'object', optional: true },
    jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
  },
  cache: {
    keys: ['containerUri', 'accept', 'filters', 'jsonContext', 'webId', '#webId']
  },
  async handler(ctx) {
    const { containerUri, filters, jsonContext } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    const { accept } = {
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
          ${await ctx.call('ontologies.getRdfPrefixes')}
          CONSTRUCT  {
            <${containerUri}>
              a ?containerType ;
              <http://www.w3.org/ns/ldp#contains> ?s1 ;
              <http://purl.org/dc/terms/title> ?title ;
              <http://purl.org/dc/terms/description> ?description .
          }
          WHERE {
            <${containerUri}> a <http://www.w3.org/ns/ldp#Container>, ?containerType .
            OPTIONAL { <${containerUri}> <http://purl.org/dc/terms/title> ?title . }
            OPTIONAL { <${containerUri}> <http://purl.org/dc/terms/description> ?description . }
            OPTIONAL {
              <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?s1 .
              ${filtersQuery.where}
            }
          }
        `,
        accept,
        webId
      });

      if (Object.keys(result).length === 1 && result['@context']) {
        throw new MoleculerError(
          `Container not found ${containerUri} (webId ${webId} / dataset ${ctx.meta.dataset})`,
          404,
          'NOT_FOUND'
        );
      }

      // Request each resources (in parallel)
      const resources =
        !result || !result.contains
          ? []
          : await Promise.all(
              arrayOf(result.contains).flatMap(async resourceUri => {
                try {
                  // We pass the accept/jsonContext parameters only if they are explicit
                  const resource = await ctx.call(
                    'ldp.resource.get',
                    cleanUndefined({
                      resourceUri,
                      webId,
                      jsonContext,
                      accept
                    })
                  );

                  // Ensure a valid resource is returned (in some case, we may have only the context)
                  if (resource['@id'] || resource.id) {
                    // If we have a child container, remove the ldp:contains property and add a ldp:Resource type
                    // We are copying SOLID: https://github.com/assemblee-virtuelle/semapps/issues/429#issuecomment-768210074
                    if (isContainer(resource)) {
                      delete resource['ldp:contains'];
                      const typePredicate = resource.type ? 'type' : '@type';
                      resource[typePredicate] = arrayOf(resource[typePredicate]);
                      resource[typePredicate].push('ldp:Resource');
                    }

                    return resource;
                  }
                } catch (e) {
                  // Ignore a resource if it is not found
                  if (e.name !== 'MoleculerError') throw e;
                }
                return [];
              })
            );

      result = await ctx.call('jsonld.parser.compact', {
        input: {
          '@id': containerUri,
          '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
          'http://purl.org/dc/terms/title': result.title,
          'http://purl.org/dc/terms/description': result.description,
          'http://www.w3.org/ns/ldp#contains': resources
        },
        context: jsonContext || (await ctx.call('jsonld.context.get'))
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
      const blankNodesQuery = buildBlankNodesQuery(4);

      return await ctx.call('triplestore.query', {
        query: `
          ${await ctx.call('ontologies.getRdfPrefixes')}
          CONSTRUCT  {
            <${containerUri}>
              a ?containerType ;
              ldp:contains ?s1 .
            ${blankNodesQuery.construct}
          }
          WHERE {
            <${containerUri}> a ldp:Container, ?containerType .
            OPTIONAL {
              <${containerUri}> ldp:contains ?s1 .
              ${blankNodesQuery.where}
              ${filtersQuery.where}
            }
          }
        `,
        accept,
        webId
      });
    }
  }
};
