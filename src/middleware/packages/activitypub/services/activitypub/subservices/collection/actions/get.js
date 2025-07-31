const { sanitizeSparqlUri } = require('@semapps/triplestore');
const { MoleculerError } = require('moleculer').Errors;
const { getValueFromDataType } = require('../../../../../utils');

/**
 * Retrieves the collection metadata from the triplestore
 * @param {object} ctx - The Moleculer context
 * @param {string} collectionUri - The URI of the collection
 * @param {string} webId - The webId of the user requesting the collection
 * @returns {Promise<object>} The collection metadata
 */
async function getCollectionMetadata(ctx, collectionUri, webId, dataset) {
  const results = await ctx.call('triplestore.query', {
    query: `
      PREFIX as: <https://www.w3.org/ns/activitystreams#>
      PREFIX semapps: <http://semapps.org/ns/core#>
      SELECT ?ordered ?summary ?dereferenceItems ?itemsPerPage ?sortPredicate ?sortOrder
      WHERE {
        <${collectionUri}> a <https://www.w3.org/ns/activitystreams#Collection> . # This will return [] if the user has no read permission
        BIND (EXISTS{<${collectionUri}> a <https://www.w3.org/ns/activitystreams#OrderedCollection>} AS ?ordered)
        OPTIONAL { <${collectionUri}> as:summary ?summary . }
        OPTIONAL { <${collectionUri}> semapps:dereferenceItems ?dereferenceItems . }
        OPTIONAL { <${collectionUri}> semapps:itemsPerPage ?itemsPerPage . }
        OPTIONAL { <${collectionUri}> semapps:sortPredicate ?sortPredicate . }
        OPTIONAL { <${collectionUri}> semapps:sortOrder ?sortOrder . }
      }
    `,
    dataset,
    webId: 'system'
  });

  if (results.length === 0) {
    throw new MoleculerError('Not found', 404, 'NOT_FOUND');
  }

  return Object.fromEntries(Object.entries(results[0]).map(([key, result]) => [key, getValueFromDataType(result)]));
}

async function verifyCursorExists(ctx, collectionUri, cursor, dataset) {
  const cursorResult = await ctx.call('triplestore.query', {
    query: `
      PREFIX as: <https://www.w3.org/ns/activitystreams#>
      SELECT ?itemExists
      WHERE {
        BIND (EXISTS{ <${collectionUri}> as:items <${cursor}> } AS ?itemExists)
      }
    `,
    dataset,
    webId: 'system'
  });
  const itemExists = cursorResult[0]?.itemExists?.value === 'true';
  if (!itemExists) {
    throw new MoleculerError(`Cursor not found: ${cursor}`, 404, 'NOT_FOUND');
  }
}

async function validateCursorParams(ctx, collectionUri, beforeEq, afterEq, dataset) {
  if (beforeEq && afterEq) {
    throw new MoleculerError('Cannot get a collection with both beforeEq and afterEq', 400, 'BAD_REQUEST');
  }
  if (beforeEq || afterEq) {
    await verifyCursorExists(ctx, collectionUri, beforeEq || afterEq, dataset);
  }
}

/**
 * Fetches the collection item URIs from the triplestore
 * @param {object} ctx - The Moleculer context
 * @param {string} collectionUri - The URI of the collection
 * @param {object} options - The collection options
 * @returns {Promise<Array>} The collection item URIs
 */
async function fetchCollectionItemURIs(ctx, collectionUri, options, dataset) {
  const result = await ctx.call('triplestore.query', {
    query: `
      PREFIX as: <https://www.w3.org/ns/activitystreams#>
      SELECT DISTINCT ?itemUri
      WHERE {
        <${collectionUri}> a as:Collection .
        OPTIONAL { 
          <${collectionUri}> as:items ?itemUri . 
          ${options.ordered ? `OPTIONAL { ?itemUri <${options.sortPredicate}> ?order . }` : ''}
        }
      }
      ${
        options.ordered
          ? `ORDER BY ${options.sortOrder === 'http://semapps.org/ns/core#DescOrder' ? 'DESC' : 'ASC'}( ?order )`
          : ''
      }
    `,
    dataset,
    webId: 'system'
  });

  // Filter out the nodes that don't have an itemUri
  // and return the itemUris values instead of the nodes
  return result.filter(node => node.itemUri).map(node => node.itemUri.value);
}

/**
 * Reduces the items array to the items before the beforeEq cursor or after the afterEq cursor, including the cursor itself
 * Determines and returns :
 *  - the next or previous cursor, depending on the direction of the requested cursor, used to generates the next/prev links
 *  - the first and last item of the collection
 * @param {Array} allItems - The collection items
 * @param {string} beforeEq - The cursor to end the pagination at
 * @param {string} afterEq - The cursor to start the pagination from
 * @returns {object} The paginated items, previous cursor, next cursor, first item, last item
 */
function applyPagination(allItemURIs, beforeEq, afterEq) {
  let prevCursorUri;
  let nextCursorUri;
  let itemURIs = allItemURIs;
  const firstItemUri = itemURIs[0];
  const lastItemUri = itemURIs[itemURIs.length - 1];

  if (beforeEq) {
    // If there is a beforeEq cursor, reduce the items array to the items before the cursor, including the cursor itself
    // and determine the cursor uri to use for the "next" link
    const index = itemURIs.findIndex(item => item === beforeEq);
    nextCursorUri = itemURIs[index + 1];
    itemURIs = itemURIs.slice(0, index + 1);
  } else if (afterEq) {
    // If there is an afterEq cursor, reduce the items array to the items after the cursor, including the cursor itself
    // and determine the cursor uri to use for the "prev" link
    const index = itemURIs.findIndex(item => item === afterEq);
    prevCursorUri = itemURIs[index - 1];
    itemURIs = itemURIs.slice(index);
  }

  return {
    itemURIs,
    prevCursorUri,
    nextCursorUri,
    firstItemUri,
    lastItemUri
  };
}

/**
 * Selects and (possibly) dereferences the items in the collection
 * The call to ldp.resource.get acts as a WAC check
 * Returns the item URIs directly if dereferencing is disabled
 * Determines the previous and next item URIs to use for the next/prev links
 * @param {object} ctx - The Moleculer context
 * @param {Array} items - The collection items
 * @param {object} options - The collection options
 * @param {string} webId - The webId of the user requesting the collection
 * @param {object} cursorDirection - The direction of the requested cursor
 * @returns {object} The selected and (possibly) dereferenced items, previous item uri, next item uri
 */
async function selectAndDereferenceItems(ctx, allItemURIs, options, webId, cursorDirection) {
  let selectedItems = [];
  let itemUri = null;
  let nextItemUri = null;
  let previousItemUri = null;

  // Pagination is enabled but no page is selected, we will display the "menu" so we don't need to dereference anything
  if (options.itemsPerPage && !cursorDirection.hasBeforeEq && !cursorDirection.hasAfterEq) {
    return {
      items: allItemURIs,
      previousItemUri,
      nextItemUri
    };
  }

  do {
    itemUri = cursorDirection.hasBeforeEq ? allItemURIs.pop() : allItemURIs.shift();
    if (itemUri) {
      if (options.dereferenceItems) {
        try {
          let item = await ctx.call('ldp.resource.get', {
            resourceUri: itemUri,
            webId: ctx.meta.impersonatedUser || webId
          });
          delete item['@context']; // Don't keep the items individual context
          selectedItems.push(item);
        } catch (e) {
          if (e.code === 404 || e.code === 403) {
            ctx.broker.logger.debug(`Item not found with URI: ${itemUri}`);
          } else {
            throw e;
          }
        }
      } else {
        // If dereferencing is disabled, keep only the item URI
        selectedItems.push(itemUri);
      }
    }
  } while ((selectedItems.length < options.itemsPerPage || !options.itemsPerPage) && itemUri);

  // Get the missing cursors for the next/prev links (complements the cursors already determined in applyPagination)
  if (cursorDirection.hasBeforeEq) {
    // also reverse the items in this case (as we pop them in the loop, they are selected in reverse order)
    selectedItems.reverse();
    previousItemUri = allItemURIs.pop();
  } else if (cursorDirection.hasAfterEq) {
    nextItemUri = allItemURIs.shift();
  }

  return {
    items: selectedItems,
    previousItemUri,
    nextItemUri
  };
}

const formatOptions = options => ({
  summary: options.summary,
  'semapps:dereferenceItems': options.dereferenceItems,
  'semapps:itemsPerPage': options.itemsPerPage,
  'semapps:sortPredicate': options.sortPredicate,
  'semapps:sortOrder': options.sortOrder
});

function formatResponse(
  ctx,
  {
    items,
    options,
    prevCursorUri,
    nextCursorUri,
    firstItemUri,
    lastItemUri,
    collectionUri,
    beforeEq,
    afterEq,
    localContext
  }
) {
  const itemsProp = options.ordered ? 'orderedItems' : 'items';

  if (options.itemsPerPage && !beforeEq && !afterEq) {
    // Pagination is enabled but no page is selected, return the collection
    return {
      '@context': localContext,
      id: collectionUri,
      type: options.ordered ? 'OrderedCollection' : 'Collection',
      ...formatOptions(options),
      first: firstItemUri ? `${collectionUri}?afterEq=${encodeURIComponent(firstItemUri)}` : undefined,
      last: lastItemUri ? `${collectionUri}?beforeEq=${encodeURIComponent(lastItemUri)}` : undefined
    };
  }

  // Pagination is enabled and a page is selected, return the selected page
  if (options.itemsPerPage) {
    return {
      '@context': localContext,
      id: `${collectionUri}?${beforeEq ? 'beforeEq' : 'afterEq'}=${encodeURIComponent(beforeEq || afterEq)}`,
      type: options.ordered ? 'OrderedCollectionPage' : 'CollectionPage',
      partOf: collectionUri,
      prev: prevCursorUri ? `${collectionUri}?beforeEq=${encodeURIComponent(prevCursorUri)}` : undefined,
      next: nextCursorUri ? `${collectionUri}?afterEq=${encodeURIComponent(nextCursorUri)}` : undefined,
      [itemsProp]: items
    };
  }

  // No pagination, return the collection
  return {
    '@context': localContext,
    id: collectionUri,
    type: options.ordered ? 'OrderedCollection' : 'Collection',
    ...formatOptions(options),
    [itemsProp]: items
  };
}

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    beforeEq: { type: 'string', optional: true },
    afterEq: { type: 'string', optional: true },
    webId: { type: 'string', optional: true },
    jsonContext: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    }
  },
  async handler(ctx) {
    const { resourceUri: collectionUri, jsonContext } = ctx.params;
    const beforeEq = ctx.params.beforeEq || ctx.meta.queryString?.beforeEq; // cursor param when moving backwards
    const afterEq = ctx.params.afterEq || ctx.meta.queryString?.afterEq; // cursor param when moving forwards
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const localContext = await ctx.call('jsonld.context.get');

    await ctx.call('permissions.check', { uri: collectionUri, type: 'resource', mode: 'acl:Read', webId });

    // Get dataset here since we can't call the method from internal functions
    const dataset = this.getCollectionDataset(collectionUri);

    sanitizeSparqlUri(collectionUri);
    sanitizeSparqlUri(beforeEq);
    sanitizeSparqlUri(afterEq);

    await validateCursorParams(ctx, collectionUri, beforeEq, afterEq, dataset);

    const options = await getCollectionMetadata(ctx, collectionUri, webId, dataset);

    const allItemURIs = await fetchCollectionItemURIs(ctx, collectionUri, options, dataset);
    const {
      itemURIs: paginatedItemURIs,
      prevCursorUri: initialPrevCursor,
      nextCursorUri: initialNextCursor,
      firstItemUri,
      lastItemUri
    } = applyPagination(allItemURIs, beforeEq, afterEq);

    const {
      items: processedItems,
      previousItemUri,
      nextItemUri
    } = await selectAndDereferenceItems(ctx, paginatedItemURIs, options, webId, {
      hasBeforeEq: !!beforeEq,
      hasAfterEq: !!afterEq
    });

    // Use the items directly as cursors if they exist
    const prevCursorUri = previousItemUri || initialPrevCursor;
    const nextCursorUri = nextItemUri || initialNextCursor;

    const response = formatResponse(ctx, {
      items: processedItems,
      options,
      prevCursorUri,
      nextCursorUri,
      firstItemUri,
      lastItemUri,
      collectionUri,
      beforeEq,
      afterEq,
      localContext
    });

    return await ctx.call('jsonld.parser.compact', {
      input: response,
      context: jsonContext || localContext
    });
  }
};
