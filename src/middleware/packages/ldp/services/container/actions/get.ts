import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
import { buildFiltersQuery, isContainer, cleanUndefined, arrayOf } from '../../../utils.ts';

const { MoleculerError } = require('moleculer').Errors;

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    filters: { type: 'object', optional: true },
    doNotIncludeResources: { type: 'boolean', default: false },
    jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
  },
  cache: {
    keys: ['containerUri', 'filters', 'doNotIncludeResources', 'jsonContext', 'webId', '#webId']
  },
  async handler(ctx) {
    const { containerUri, accept, filters, doNotIncludeResources, jsonContext } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Read', webId });

    if (accept && accept !== MIME_TYPES.JSON)
      throw new Error(`The ldp.container.get action now only support JSON-LD. Provided: ${accept}`);

    let containerResults = await ctx.call('triplestore.query', {
      query: `
        ${await ctx.call('ontologies.getRdfPrefixes')}
        CONSTRUCT  {
          <${containerUri}> ?p ?o .
        }
        FROM <${containerUri}>
        WHERE {
          <${containerUri}> ?p ?o .
          MINUS { <${containerUri}> ldp:contains ?o } .
        }
      `,
      accept,
      webId: 'system'
    });

    if (Object.keys(containerResults).length === 1 && containerResults['@context']) {
      throw new MoleculerError(`Container not found ${containerUri}`, 404, 'NOT_FOUND');
    }

    if (!doNotIncludeResources) {
      const filtersQuery = buildFiltersQuery(filters);

      const resourcesResults = await ctx.call('triplestore.query', {
        query: `
          ${await ctx.call('ontologies.getRdfPrefixes')}
          SELECT ?s1
          FROM <${containerUri}>
          WHERE {
            <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?s1 .
            ${filtersQuery.where}
          }
        `,
        accept,
        webId
      });

      const resourcesUris = resourcesResults?.map(node => node.s1.value);

      // Request each resources (in parallel)
      containerResults['http://www.w3.org/ns/ldp#contains'] = await Promise.all(
        arrayOf(resourcesUris).flatMap(async resourceUri => {
          try {
            // We pass the accept/jsonContext parameters only if they are explicit
            const resource = await ctx.call(
              'ldp.resource.get',
              cleanUndefined({
                resourceUri,
                webId,
                jsonContext
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
    }

    let compactResults = await ctx.call('jsonld.parser.compact', {
      input: containerResults,
      context: jsonContext || (await ctx.call('jsonld.context.get'))
    });

    // If the ldp:contains is a single object, wrap it in an array for easier handling on the front side
    const ldpContainsKey = Object.keys(compactResults).find(key =>
      ['http://www.w3.org/ns/ldp#contains', 'ldp:contains', 'contains'].includes(key)
    );
    if (ldpContainsKey && !Array.isArray(compactResults[ldpContainsKey])) {
      compactResults[ldpContainsKey] = [compactResults[ldpContainsKey]];
    }

    return compactResults;
  }
} satisfies ActionSchema;

export default Schema;
