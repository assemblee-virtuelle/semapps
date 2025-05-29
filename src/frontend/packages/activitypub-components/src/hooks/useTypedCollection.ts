import { useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { getOrCreateWsChannel, SemanticDataProvider } from '@semapps/semantic-data-provider';
import { LdoBase, ShapeType } from '@ldo/ldo';
import { ConnectedLdoDataset, createConnectedLdoDataset } from '@ldo/connected';
import { SolidConnectedPlugin, solidConnectedPlugin } from '@ldo/connected-solid';
import { useInfiniteQuery, QueryFunction } from '@tanstack/react-query';
import { CollectionShapeType, OrderedCollectionPage } from '@activitypods/ldo-shapes';
import rdf from 'rdf-ext';
import type { UseCollectionOptions, SolidNotification } from '../types';
import { arrayOf, parseJsonLdToQuads } from '../utils';
import { getActivityStreamsValidator, getAndValidateLdoSubject } from '../utils/shaclValidation';

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

  const { totalItems, isPaginated } = getTotalItemsFromPages(collectionQuery.data?.pages || []);

  // 2. Filter items from the collection pages that match the given shape types.
  const filteredItems = getFilteredItemsFromCollectionPages(collectionQuery.data?.pages || [], shapeTypes);

  // 3. Set up notifications for live updates, if enabled.
  const liveUpdatesStatus = useSubscribeToUpdates({
    uri: collectionUri,
    enabled: subscribeToUpdates,
    onAddItem: _item => {
      // Since we don't know where the item was added, we refetch the whole collection ¯\_(ツ)_/¯.
      collectionQuery.refetch();
    },
    onRemoveItem: uri => removeItemFromQueryData(uri, collectionQuery)
  });

  // 4. Pagination logic.

  const [requestedNextItems, setRequestedNextItems] = useState(pageSize);
  const [requestedPrevItems, setRequestedPrevItems] = useState(0);

  // Automatically fetch next page, if more items are requested.
  if (requestedNextItems > filteredItems.length && collectionQuery.hasNextPage && !collectionQuery.isLoading) {
    collectionQuery.fetchNextPage();

    // Should fetch previous page?
  } else if (
    requestedPrevItems > filteredItems.length &&
    collectionQuery.hasPreviousPage &&
    !collectionQuery.isLoading
  ) {
    collectionQuery.fetchPreviousPage();
  }

  /** Fetch next n (filtered) items. */
  const fetchNext = useCallback(
    (noItems: number = pageSize) => {
      setRequestedNextItems(filteredItems.length + noItems);
    },
    [setRequestedNextItems, requestedNextItems]
  );
  /** Fetch previous n (filtered) items. */
  const fetchPrevious = useCallback(
    (noItems: number = pageSize) => {
      setRequestedPrevItems(filteredItems.length + noItems);
    },
    [setRequestedPrevItems, requestedNextItems]
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
    getNextPageParam: current => current.raw?.next,
    getPreviousPageParam: current => current.raw?.prev
  });

  return infiniteQueryData;
};

const getFetchCollectionPage = (fetchFn: typeof fetch) =>
  (async ({ pageParam: pageUri }) => {
    // Note, page is not necessarily of type OrderedCollectionPage but it is a partial in any case.
    const page = await (await fetchFn(pageUri)).json();
    if (!page) {
      throw new Error(`Could not fetch page ${pageUri}`);
    }

    const itemsKey = 'orderedItems' in page ? 'orderedItems' : 'items';

    if (arrayOf(page[itemsKey]).length === 0) {
      // No items in page.
      return { itemIds: [], dataset: null, page };
    }

    // Keep track of item ids in this order (in the rdf dataset the order is lost).
    const itemIds: string[] = arrayOf(page[itemsKey])
      .map((itemOrId: any) => itemOrId?.['@id'] || itemOrId?.id || itemOrId)
      .filter(item => item); // Ensure item is not undefined.

    const solidConnectedDataset = createConnectedLdoDataset([solidConnectedPlugin]);
    solidConnectedDataset.setContext('solid', { fetch: fetchFn });
    // Load the page into the dataset.
    solidConnectedDataset.addAll(await parseJsonLdToQuads(page));

    const resource = solidConnectedDataset.getResource(pageUri);
    if (resource.type === 'InvalidIdentifierResouce') {
      return { itemIds, dataset: null, raw: page };
    }

    const ldoBuilder = solidConnectedDataset.usingType(CollectionShapeType);

    // Run a link query to ensure that all items are dereferenced (the results are kept in the dataset).
    await ldoBuilder
      .startLinkQuery(resource, (page.id || page['@id']) as string, {
        // **TODO**: We might have to ensure that items is not just a string but considered an object in the datamodel.
        items: true,
        orderedItems: true
      })
      .run({ reload: false });

    return { dataset: solidConnectedDataset, itemIds, raw: page };
  }) satisfies QueryFunction<object, unknown[], string>;

const getFilteredItemsFromCollectionPages = <T extends LdoBase>(
  pages: {
    dataset: ConnectedLdoDataset<SolidConnectedPlugin[]> | null;
    itemIds: string[];
  }[],
  shapeTypes: ShapeType<T>[]
) => {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useEffect(async () => {
    // We need to load the shacl resources and match them to the shape types.
    const validator = await getActivityStreamsValidator();

    const validatedItems = await Promise.all(
      // For every page, ...
      pages.map(async page => {
        const items: T[] = await Promise.all(
          // For every item in the page, ...
          page.itemIds.map(
            async itemId =>
              // Validate item against the shape types and return the ldo object of the correct type, if it is valid.
              page.dataset && getAndValidateLdoSubject(itemId, page.dataset, shapeTypes, validator)
          )
        ).then(results => results.filter(item => !!item)); // Filter out null items.

        return items;
      })
    ).then(results => results.flat());

    setFilteredItems(validatedItems);
    // TODO: Cache filtered items by page, so that we don't have to re-filter them every time?
  }, [pages, shapeTypes]);

  return filteredItems;
};

const getTotalItemsFromPages = (
  pages: {
    itemIds: string[];
    raw?: OrderedCollectionPage;
  }[]
): { totalItems: number | undefined; isPaginated: boolean | undefined } => {
  if (pages.length === 0) return { isPaginated: undefined, totalItems: undefined };

  // Check if collection is paginated. We assume that the collection is paginated if there are pages with first, last, prev or next.
  const isPaginated =
    pages.length === 0
      ? undefined
      : !!pages.find(page => 'first' in page.raw || 'next' in page || 'last' in page || 'prev' in page);

  // Approach 1: Get total items info by checking if the page has a totalItems property.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const totalItemsByCollectionInfo = pages.find(page => 'totalItems' in page)?.raw?.totalItems;
  if (totalItemsByCollectionInfo) return { totalItems: totalItemsByCollectionInfo, isPaginated };

  // Approach 2: If collection is not paginated, we count the number of items in the collection.
  if (!isPaginated) {
    return { totalItems: pages[0].itemIds.length, isPaginated };
  }

  // Approach 3: If we have the whole collection loaded, we can count the items.

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const firstPage = pages.find(page => page.raw.first)?.raw?.first;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const lastPage = pages.find(page => page.raw.last)?.raw?.last;

  // We assume that all pages are loaded if the first and last page is available.
  // In that case, count all pages' items.
  if (firstPage && lastPage)
    return {
      isPaginated,
      totalItems: pages
        // Get length of page
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        .map(page => ('orderedItems' in page.raw ? page.raw?.orderedItems?.length : page.raw?.items?.length || 0))
        // Sum all page length counts.
        .reduce((prev: number, current: number) => prev + current)
    };

  // If no approach succeeded, we return undefined.
  return { totalItems: undefined, isPaginated };
};

/** A somewhat hacky way to remove an item from the useInfiniteCollectionQuery. */
const removeItemFromQueryData = (itemUri: string, collectionQuery: ReturnType<typeof useInfiniteCollectionQuery>) => {
  // Manipulate data about total items. Sorry, a bit hacky...
  collectionQuery.data?.pages.forEach(page => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (page.raw.orderedItems) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
      page.raw.orderedItems = arrayOf(page.raw.orderedItems).filter(item => (item.id || item['@id']) !== itemUri);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (page.raw?.items) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
      page.raw.items = arrayOf(page.raw.items).filter(item => (item.id || item['@id']) !== itemUri);
    }
    // Remove item from the dataset, if it exists.
    page.dataset?.deleteMatches(rdf.namedNode(itemUri));

    // There might be a totalItems property in the page, so we need to update it.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (Number.isInteger(page.raw.totalItems)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
      page.raw.totalItems -= 1;
    }
  });
};
