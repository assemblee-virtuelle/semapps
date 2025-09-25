import { useCallback, useState, useEffect, useRef } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { getOrCreateWsChannel, SemanticDataProvider } from '@semapps/semantic-data-provider';
import { LdoBase, ShapeType } from '@ldo/ldo';
import { createConnectedLdoDataset } from '@ldo/connected';
import { solidConnectedPlugin } from '@ldo/connected-solid';
import { useInfiniteQuery, QueryFunction } from '@tanstack/react-query';
import { OrderedCollectionPageShapeType } from '@activitypods/ldo-shapes';
import rdf from 'rdf-ext';
import type { UseCollectionOptions, SolidNotification } from '../types';
import { arrayOf, parseJsonLdToQuads } from '../utils';
import {
  getActivityStreamsValidator,
  getAndValidateLdoSubject as validateAndGetLdoSubject
} from '../utils/shaclValidation';

interface UseTypedCollectionOptions<ItemType extends LdoBase> {
  shapeTypes: ShapeType<ItemType>[]; // TODO: Needs extended shape type?
  pageSize: number;
}

/**
 * Subscribe to a collection. Supports pagination.
 * @param collectionUri The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions & UseTypedCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false, pageSize: 10 }` and requires at least one ldo @see {ShapeType}.
 */
const useTypedCollection = <ItemType extends LdoBase>(
  collectionUri: string,
  options: UseCollectionOptions & UseTypedCollectionOptions<ItemType>
) => {
  const { pageSize = 10, liveUpdates: subscribeToUpdates = false, shapeTypes } = options;
  if (!shapeTypes.length) throw new Error('At least one ShapeType is required to filter the collection by.');

  // 1. Fetch the collection
  const collectionQuery = useInfiniteCollectionQuery(collectionUri);

  const { totalItems, isPaginated } = useTotalItemsFromPages(collectionQuery.data);

  // 2. Filter items from the collection pages that match the given shape types.
  const filteredItems = useFilteredItemsFromPages(collectionQuery.data, shapeTypes);

  // 3. Set up notifications for live updates, if enabled.
  const liveUpdatesStatus = useSubscribeToUpdates({
    uri: collectionUri,
    enabled: subscribeToUpdates,
    onAddItem: _item => {
      // Since we don't know where the item was added, we refetch the whole collection ¯\_(ツ)_/¯.
      collectionQuery.refetch();
    },
    onRemoveItem: uri => {
      removeItemFromQueryData(uri, collectionQuery);
    }
  });

  // 4. Pagination logic.

  const [requestedNextItems, setRequestedNextItems] = useState(pageSize);
  const [requestedPrevItems, setRequestedPrevItems] = useState(0);

  // Automatically fetch next page, if more items are requested.
  useEffect(() => {
    if (requestedNextItems > filteredItems.length && collectionQuery.hasNextPage && !collectionQuery.isLoading) {
      collectionQuery.fetchNextPage();
    }
  }, [requestedNextItems, filteredItems.length, collectionQuery.hasNextPage, collectionQuery.isLoading]);
  // Automatically fetch previous page, if more items are requested.
  useEffect(() => {
    if (requestedPrevItems > filteredItems.length && collectionQuery.hasPreviousPage && !collectionQuery.isLoading) {
      collectionQuery.fetchPreviousPage();
    }
  }, [requestedPrevItems, filteredItems.length, collectionQuery.hasPreviousPage, collectionQuery.isLoading]);

  /** Fetch next n (filtered) items. */
  const fetchNext = useCallback(
    (noItems: number = pageSize) => {
      setRequestedNextItems(filteredItems.length + noItems);
    },
    [filteredItems.length, pageSize]
  );
  /** Fetch previous n (filtered) items. */
  const fetchPrevious = useCallback(
    (noItems: number = pageSize) => {
      setRequestedPrevItems(filteredItems.length + noItems);
    },
    [filteredItems.length, pageSize]
  );

  return {
    // TODO: Do we want to expose all properties from the collection query?
    ...collectionQuery,
    items: filteredItems,
    liveUpdatesStatus,
    fetchNext,
    fetchPrevious,
    totalItems,
    isPaginated
  };
};

export default useTypedCollection;

const useSubscribeToUpdates = ({
  uri,
  enabled = true,
  onAddItem,
  onRemoveItem
}: {
  uri: string;
  enabled: boolean;
  onAddItem: (item: LdoBase | string) => void;
  onRemoveItem: (itemUri: string) => void;
}) => {
  const { fetch: fetchFn } = useDataProvider<SemanticDataProvider>();
  const [status, setStatus] = useState<{
    error?: any;
    status: 'error' | 'closed' | 'connected' | 'connecting' | 'disabled';
  }>({
    status: enabled ? 'connecting' : 'disabled'
  });

  useEffect(() => {
    const webSocketRef = useRef<WebSocket | null>(null);

    // Nothing to do, return empty clean up function.
    if (!enabled || !uri) return () => {};

    // Create ws that listens to collectionUri changes
    getOrCreateWsChannel(fetchFn, uri)
      .then(ws => {
        webSocketRef.current = ws; // Keep a ref to the webSocket so that it can be used elsewhere
        webSocketRef.current.addEventListener('message', event => {
          // TODO: correct ldo type
          const data: SolidNotification = JSON.parse(event.data as string);
          if (data.type === 'Add') {
            onAddItem(data.object);
          } else if (data.type === 'Remove') {
            onRemoveItem(data.object);
          }
        });
        webSocketRef.current.addEventListener('error', event => {
          setStatus({ error: event, status: 'error' });
          // TODO: Retry after a while (use react query?).
        });
        webSocketRef.current.addEventListener('close', _event => {
          if (!status.error) {
            setStatus({ status: 'closed' });
          }
        });
      })
      .catch(error => {
        setStatus({ status: 'error', error });
      });

    // Clean up, i.e. close channel.
    return () => {
      webSocketRef.current?.close();
    };
  }, [uri, enabled, onAddItem, onRemoveItem]);

  return status;
};

const useInfiniteCollectionQuery = (collectionUri: string) => {
  const { data: identity } = useGetIdentity();
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const { fetch: fetchFn } = dataProvider;

  const infiniteQueryData = useInfiniteQuery({
    queryKey: ['collection', { uri: collectionUri }],
    queryFn: getFetchCollectionPage(fetchFn),
    initialPageParam: collectionUri, // This could be the place to use as page param, whe collection is different. Probably not such an important thing at all.
    enabled: !!(collectionUri && identity?.id),
    getNextPageParam: current => current.data?.next,
    getPreviousPageParam: current => current.data?.prev
  });

  return infiniteQueryData;
};

const getFetchCollectionPage = (fetchFn: typeof fetch) =>
  (async ({ pageParam: pageUri }) => {
    // Note, page is not necessarily of type OrderedCollectionPage but it is a partial in any case.
    const jsonPage = await (await fetchFn(pageUri)).json();
    if (!jsonPage || typeof jsonPage !== 'object') {
      throw new Error(`Could not fetch page ${pageUri}. Response is invalid.`);
    }

    const itemsKey = 'orderedItems' in jsonPage ? 'orderedItems' : 'items';

    if (arrayOf(jsonPage[itemsKey]).length === 0) {
      // No items in page.
      return { itemIds: [], dataset: null, data: null };
    }

    // Keep track of item ids in this order (in the rdf dataset the order is lost).
    const itemIds: string[] = arrayOf(jsonPage[itemsKey])
      .map((itemOrId: any) => itemOrId?.['@id'] || itemOrId?.id || itemOrId)
      .filter(item => item); // Ensure item is not undefined.

    // Parse the page into a dataset.
    // TODO: Move to data provider.
    const dataset = createConnectedLdoDataset([solidConnectedPlugin]);
    dataset.setContext('solid', { fetch: fetchFn });
    dataset.addAll(await parseJsonLdToQuads(jsonPage));

    const resource = dataset.getResource(pageUri);
    if (resource.type === 'InvalidIdentifierResource') {
      return { itemIds, dataset: null, pageUri, data: null };
    }

    const ldoBuilder = dataset.usingType(OrderedCollectionPageShapeType);

    // Run a link query to ensure that all items are dereferenced (the results are kept in the dataset).
    await ldoBuilder
      .startLinkQuery(resource, pageUri, {
        items: true,
        orderedItems: true
      })
      .run({ reload: false });

    return { dataset, itemIds, pageUri, data: ldoBuilder.fromSubject(pageUri) };
  }) satisfies QueryFunction<object, unknown[], string>;

const useTotalItemsFromPages = (
  queryData: ReturnType<typeof useInfiniteCollectionQuery>['data']
): { totalItems: number | undefined; isPaginated: boolean | undefined } => {
  if (!queryData?.pages.length) return { isPaginated: undefined, totalItems: undefined };
  const { pages } = queryData;

  // Check if collection is paginated. We assume that the collection is paginated if there are pages with first, last, prev or next.
  const isPaginated =
    pages.length === 0
      ? undefined
      : !!pages.find(
          page =>
            page.data && ('first' in page.data || 'next' in page.data || 'last' in page.data || 'prev' in page.data)
        );

  // Approach 1: Get total items info by checking if the page has a totalItems property.
  const totalItemsByCollectionInfo = pages.find(page => 'totalItems' in page)?.data?.totalItems;
  if (totalItemsByCollectionInfo) return { totalItems: totalItemsByCollectionInfo, isPaginated };

  // Approach 2: If collection is not paginated, we count the number of items in the collection.
  if (!isPaginated) {
    return { totalItems: pages[0].itemIds.length, isPaginated };
  }

  // Approach 3: If we have the whole collection loaded, we can count the items.

  const firstPage = pages.find(page => page.data?.first)?.data?.first;
  const lastPage = pages.find(page => page.data?.last)?.data?.last;

  // We assume that all pages are loaded if the first and last page is available.
  // In that case, count all pages' items.
  if (firstPage && lastPage)
    return {
      isPaginated,
      totalItems: pages
        // Get length of page
        .map(page => page.data?.orderedItems?.size || page.data?.items?.size || 0)
        // Sum all page length counts.
        .reduce((prev: number, current: number) => prev + current)
    };

  // If no approach succeeded, we return undefined.
  return { totalItems: undefined, isPaginated };
};

const useFilteredItemsFromPages = <T extends LdoBase>(
  queryData: ReturnType<typeof useInfiniteCollectionQuery>['data'],
  shapeTypes: ShapeType<T>[]
) => {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  const filterItems = useCallback(async () => {
    // We need to load the shacl resources and match them to the shape types.
    const validator = await getActivityStreamsValidator();

    const pages = queryData?.pages;

    if (!pages || pages.length === 0) {
      setFilteredItems([]);
      return;
    }
    const validatedItems = await Promise.all(
      // For every page, ...
      queryData.pages.map(async page => {
        const items: T[] = await Promise.all(
          // For every item in the page, ...
          page.itemIds.map(
            async itemId =>
              // Validate item against the shape types and return the ldo object of the correct type, if it is valid.
              page.dataset && validateAndGetLdoSubject(itemId, page.dataset, shapeTypes, validator)
          )
        ).then(results => results.filter(item => !!item)); // Filter out null items.

        return items;
      })
    ).then(results => results.flat());

    // TODO: Order items by ids.

    setFilteredItems(validatedItems);
    // TODO: Cache filtered items by page, so that we don't have to re-filter them every time?
  }, [queryData?.pages, shapeTypes]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  return filteredItems;
};

/** A somewhat hacky way to remove an item from the useInfiniteCollectionQuery. */
const removeItemFromQueryData = (itemUri: string, collectionQuery: ReturnType<typeof useInfiniteCollectionQuery>) => {
  // Manipulate data about total items. Sorry, a bit hacky...
  collectionQuery.data?.pages.forEach(page => {
    if (!page.dataset) return;
    page.dataset.deleteMatches(rdf.namedNode(itemUri));

    // There might be a totalItems property in the page, so we need to update it.
    if (page.data.totalItems && Number.isInteger(page.data.totalItems)) {
      // eslint-disable-next-line no-param-reassign
      page.data.totalItems -= 1;
    }
  });
};

// Open Question:
// - Use one dataset? It has the benefit of only having to define a single solid connected dataset and makes ng switching easier -> no need to create a connected dataset.
// - On the other hand (the only downside I can think of rn): Either you have to remove expired items from the dataset or you don't care about old data that is not used by react admin anymore. At a refetch all old data would have to be removed though.
