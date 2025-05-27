import { useCallback, useState, useEffect, useRef, RefObject } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { Quad } from '@rdfjs/types';
import { getOrCreateWsChannel, SemanticDataProvider } from '@semapps/semantic-data-provider';
import { LdoBase, ShapeType, createLdoDataset } from '@ldo/ldo';
import { ConnectedLdoDataset, createConnectedLdoDataset } from '@ldo/connected';
import { SolidConnectedPlugin, solidConnectedPlugin } from '@ldo/connected-solid';
import { useInfiniteQuery, QueryFunction, useQueryClient } from '@tanstack/react-query';
import {
  Collection,
  OrderedCollection,
  CollectionShapeType,
  CollectionPage,
  OrderedCollectionPage
} from '@activitypods/ldo-shapes';

import type { UseCollectionOptions, AwaitActivityOptions, SolidNotification } from '../types';
import { arrayOf, parseJsonLd, parseJsonLdToQuads } from '../utils';
import { namedNode } from '@rdfjs/data-model';
import { getActivityStreamsValidator } from '../utils/shaclValidation';

interface UseTypedCollectionOptions<ItemType extends LdoBase> {
  shapeTypes: ShapeType<ItemType>[]; // TODO: Needs extended shape type?
  pageSize: number;
}

type CollectionOrPage = Collection | OrderedCollection | CollectionPage | OrderedCollectionPage;

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

  const collectionQuery = useInfiniteCollectionQuery(collectionUri);

  const { totalItems, isPaginated } = getTotalItemsFromPages(collectionQuery.data?.pages || []);

  const filteredItems = getFilteredItemsFromCollectionPages(collectionQuery.data?.pages || [], shapeTypes);

  const liveUpdatesStatus = useSubscribeToUpdates({
    uri: collectionUri,
    enabled: subscribeToUpdates,
    // Those need to be callbacks!
    onAddItem(item) {
      // We can re-fetch everything..
      collectionQuery.refetch();
      // In the meanwhile, manipulate data about total items
      collectionQuery.data?.pages.forEach(page => {
        if (page.totalItems !== undefined) page.totalItems += 1;
      });
    },
    onRemoveItem(uri) {
      // Manipulate data about total items. Sorry, a bit hacky...
      collectionQuery.data?.pages.forEach(page => page.items?.delete(uri));
      collectionQuery.data?.pages.forEach(page => {
        if (page.totalItems !== undefined) page.totalItems -= 1;
      });
    }
  });

  // -- Fetching previous or next pages --
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
    // should we add them?
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
    getNextPageParam: current => current.page?.next,
    getPreviousPageParam: current => current.page?.prev
  });

  return infiniteQueryData;
};

const getFetchCollectionPage = (fetchFn: typeof fetch) =>
  (async ({ pageParam: pageUri, client, queryKey, meta, signal }) => {
    // Note, page is not necessarily of type OrderedCollectionPage but it is a partial in any case.
    const page = (await (await fetchFn(pageUri)).json()) as OrderedCollectionPage | undefined;
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
      return { itemIds, dataset: null, page };
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

    return { dataset: solidConnectedDataset, itemIds, page };
  }) satisfies QueryFunction<object, unknown[], string>;

const getFilteredItemsFromCollectionPages = <T extends LdoBase>(
  pages: {
    dataset: ConnectedLdoDataset<SolidConnectedPlugin[]>;
    itemIds: string[];
  }[],
  shapeTypes: ShapeType<T>[]
) => {
  // We need to load the shacl resources and match them to the shape types.
  const validator = await getActivityStreamsValidator();

  const validatedItems = pages.flatMap(page => {
    const itemIds = page.itemIds;

    // Validate items against the shape types.

    // Get "subsets" for each subject = itemId.
    const items = itemIds.flatMap(itemId => {
      const validationResult = validator.validate(
        { dataset: page.dataset, terms: [namedNode(itemId)] },
        { terms: shapeTypes.map(shapeType => namedNode(shapeType.shape)) }
      );

      if (!validationResult.conforms) {
        return [];
      }
      return item;
    });
  });

  // cache
  // type items according to filter
  // return items

  // this does not cache if a new fetch collection hook is called with a different page but of the same collection, right?
  //  - what we can do is to cache the individual items as part of the collection (only makes sense if not dereferenced).
  //  - also we can set up the cache to always use the parent collection URI as cache key?
  //  - this might involve finding out where the page is located among the already present pages

  return [];
};

const getTotalItemsFromPages = (
  pages: {
    itemIds: string[];
    page: OrderedCollectionPage;
  }[]
): { totalItems: number | undefined; isPaginated: boolean | undefined } => {
  // Check if collection is paginated. We assume that the collection is paginated if there are pages with first, last, prev or next.
  const isPaginated =
    pages.length === 0
      ? undefined
      : !!pages.find(page => 'first' in page.page || 'next' in page || 'last' in page || 'prev' in page);

  if (pages.length === 0) return { isPaginated, totalItems: undefined };

  // Get total items info. Sorry, there are a lot of edge cases...
  const totalItemsByCollectionInfo = pages.find(page => 'totalItems' in page)?.page.totalItems;
  if (totalItemsByCollectionInfo) return { totalItems: totalItemsByCollectionInfo, isPaginated };

  // If collection is not paginated, we count the number of items in the collection.
  if (!isPaginated) {
    return { totalItems: pages[0].itemIds.length, isPaginated };
  }

  // We check if we have the first and the last page loaded.
  const firstPage = pages.find(page => page.page.first)?.page.first;
  const lastPage = pages.find(page => page.page.last)?.page.last;

  // We assume that all pages are loaded if the first and last page is available.
  // In that case, count all pages' items.
  if (firstPage && lastPage)
    return {
      isPaginated,
      totalItems: pages
        // Get length of page
        .map(page => ('orderedItems' in page.page ? page.page.orderedItems?.length : page.page.items.length || 0))
        // Sum all page length counts.
        .reduce((prev: number, current: number) => prev + current)
    };

  return { totalItems: undefined, isPaginated };
};
