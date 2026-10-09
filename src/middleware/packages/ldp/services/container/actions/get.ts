import { MIME_TYPES } from '@semapps/mime-types';
import type { ActionSchema } from 'moleculer';
import { isContainer, isValidIri, cleanUndefined, arrayOf } from '../../../utils.ts';
import resourcesFiltersParams from '../resources-filters-params.ts';

import moleculer from 'moleculer';
const { Errors } = moleculer;

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string', optional: true },
    webId: { type: 'string', optional: true },
    accept: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    filters: { type: 'object', optional: true },
    doNotIncludeResources: { type: 'boolean', default: false },
    ...resourcesFiltersParams,
    maxPerPage: { type: 'number', optional: true },
    page: { type: 'number', default: 1 },
    sortOrder: { type: 'enum', values: ['ASC', 'DESC'], default: 'ASC' },
    sortPredicate: { type: 'string', optional: true },
    jsonContext: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }], optional: true }
  },
  cache: {
    keys: [
      'containerUri',
      'accept',
      'filters',
      'search',
      'searchPredicates',
      'near',
      'doNotIncludeResources',
      'maxPerPage',
      'page',
      'sortOrder',
      'sortPredicate',
      'jsonContext',
      'webId',
      '#webId'
    ]
  },
  async handler(ctx) {
    const { containerUri, doNotIncludeResources, maxPerPage, page, sortOrder, sortPredicate, jsonContext } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    const { accept } = {
      ...(await ctx.call('ldp.registry.getByUri', { containerUri })),
      ...ctx.params
    };

    if (accept !== MIME_TYPES.JSON)
      throw new Error(`LDP containers can only be returned with JSON-LD format at the moment.`);

    let containerResults = await ctx.call('triplestore.query', {
      query: `
        ${await ctx.call('ontologies.getRdfPrefixes')}
        CONSTRUCT  {
          <${containerUri}> ?p ?o .
        }
        WHERE {
          <${containerUri}> ?p ?o .
          MINUS { <${containerUri}> ldp:contains ?o } .
        }
      `,
      accept,
      webId: 'system'
    });

    if (Object.keys(containerResults).length === 1 && containerResults['@context']) {
      throw new MoleculerError(
        `Container not found ${containerUri} (webId ${webId} / dataset ${ctx.meta.dataset})`,
        404,
        'NOT_FOUND'
      );
    }

    if (!doNotIncludeResources) {
      const filtersQuery = await this.buildResourcesFiltersQuery(ctx);

      // Transform the prefixed predicate to a full URI if necessary
      const expandedSortPredicate =
        sortPredicate && (await ctx.call('jsonld.parser.expandPredicate', { predicate: sortPredicate }));

      // The predicate may come from a HTTP header, so make sure it cannot be used for SPARQL injection
      if (expandedSortPredicate && !isValidIri(expandedSortPredicate)) {
        throw new MoleculerError('Invalid sort predicate', 400, 'BAD_REQUEST');
      }

      // Resources without the sort predicate are kept, and put at the end whatever the sort order.
      // Without sort predicate, we still sort by URI so that pages are stable.
      const orderQuery = sortPredicate
        ? `ORDER BY (!BOUND(?sortValue)) ${sortOrder}(?sortValue) ?s1`
        : maxPerPage
          ? 'ORDER BY ?s1'
          : '';

      const limitQuery = maxPerPage ? `LIMIT ${maxPerPage} OFFSET ${(page - 1) * maxPerPage}` : '';

      const resourcesResults = await ctx.call('triplestore.query', {
        query: `
          ${await ctx.call('ontologies.getRdfPrefixes')}
          SELECT ?s1 ${sortPredicate ? '(MIN(?value) AS ?sortValue)' : ''}
          WHERE {
            <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?s1 .
            ${filtersQuery}
            ${sortPredicate ? `OPTIONAL { ?s1 <${expandedSortPredicate}> ?value }` : ''}
          }
          ${sortPredicate ? 'GROUP BY ?s1' : ''}
          ${orderQuery}
          ${limitQuery}
        `,
        accept,
        // Without WebACL checks: Fuseki checks the permissions triple by triple, which made this query take up to
        // several minutes on big containers (56 ms without). The permissions are checked below by ldp.resource.get,
        // and the resources that can't be read are left out. Only URIs are returned by this query.
        webId: 'system'
      });

      const resourcesUris = resourcesResults?.map((node: any) => node.s1.value);

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
            // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
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
