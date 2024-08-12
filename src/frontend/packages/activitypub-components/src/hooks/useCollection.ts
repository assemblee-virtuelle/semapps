import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { QueryFunction, useInfiniteQuery, useQueries, useQueryClient } from 'react-query';
import { getOrCreateWsChannel, SemanticDataProvider } from '@semapps/semantic-data-provider';
import { arrayOf } from '../utils';
import type { UseCollectionOptions, SolidNotification } from '../types';

const useItemsFromPages = (pages: any[], dereferenceItems: boolean) => {
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const items = useMemo(() => pages.flatMap(p => arrayOf(p.orderedItems || p.items)), [pages]);

  // We will force dereference, if some items are not URI string references.
  const shouldDereference = useMemo(() => {
    return dereferenceItems || items.some(item => typeof item !== 'string');
  }, [dereferenceItems, items]);

  // Dereference all items, if necessary (even if shouldDereference is false, the hook needs to be called).
  const itemQueries = useQueries(
    !shouldDereference
      ? []
      : items
          .filter(item => typeof item === 'string')
          .map(itemUri => ({
            queryKey: ['resource', itemUri],
            queryFn: async () => (await dataProvider.fetch(itemUri)).json,
            staleTime: Infinity
          }))
  );

  if (!shouldDereference) {
    return { loadedItems: items, isLoading: false, isFetching: false };
  }

  // Put all loaded items together (might be dereferenced already, so concatenate).
  const loadedItems = items
    .filter(item => typeof item !== 'string')
    .concat(
      itemQueries.flatMap(itemQuery => {
        return (itemQuery.isSuccess && itemQuery.data) || [];
      })
    );

  const errors = itemQueries.filter(q => q.error);
  return {
    loadedItems,
    isLoading: itemQueries.some(q => q.isLoading),
    isFetching: itemQueries.some(q => q.isFetching),
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Subscribe a collection. Supports pagination.
 * @param predicateOrUrl The collection URI or the predicate to get the collection URI from the identity (webId).
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: true }`
 */
const useCollection = (predicateOrUrl: string, options: UseCollectionOptions = {}) => {
  const { dereferenceItems = false, liveUpdates = true } = options;
  const { data: identity } = useGetIdentity();
  const [totalItems, setTotalItems] = useState<number>();
  const queryClient = useQueryClient();
  const [hasLiveUpdates, setHasLiveUpdates] = useState<{ status: string; error?: any; webSocket?: WebSocket }>({
    status: 'connecting'
  });
  const dataProvider = useDataProvider<SemanticDataProvider>();

  // Get collectionUrl from webId predicate or URL.
  const collectionUrl = useMemo(() => {
    if (predicateOrUrl) {
      if (predicateOrUrl.startsWith('http')) {
        return predicateOrUrl;
      }
      if (identity?.webIdData) {
        return identity?.webIdData?.[predicateOrUrl];
      }
    }
    return undefined;
    // throw new Error(`No URL available for useCollection: ${predicateOrUrl}.`);
  }, [identity, predicateOrUrl]);

  // Fetch page of collection item references (if pageParam provided)
  //  or default to `collectionUrl` (which should give you the first page).
  const fetchCollection: QueryFunction = useCallback(
    async ({ pageParam: nextPageUrl }) => {
      // Fetch page or first page (collectionUrl)
      let { json } = await dataProvider.fetch(nextPageUrl || collectionUrl);
      if (json.totalItems) setTotalItems(json.totalItems);

      // If first page, handle this here.
      if ((json.type === 'OrderedCollection' || json.type === 'Collection') && json.first) {
        if (json.first?.items) {
          if (json.first?.items.length === 0 && json.first?.next) {
            // Special case where the first property is an object without items
            ({ json } = await dataProvider.fetch(json.first?.next));
          } else {
            json = json.first;
          }
        } else {
          // Fetch the first page
          ({ json } = await dataProvider.fetch(json.first));
        }
      }

      return json;
    },
    [dataProvider, collectionUrl, identity, setTotalItems]
  );

  // Use infiniteQuery to handle pagination, fetching, etc.
  const {
    data: pageData,
    error: collectionError,
    fetchNextPage,
    refetch,
    hasNextPage,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
    isFetchingNextPage
  } = useInfiniteQuery(['collection', { collectionUrl }], fetchCollection, {
    enabled: !!(collectionUrl && identity?.id),
    getNextPageParam: (lastPage: any) => lastPage.next,
    getPreviousPageParam: (firstPage: any) => firstPage.prev
  });

  // Put all items together in a list (and dereference, if required).
  const {
    loadedItems: items,
    isLoading: isLoadingItems,
    isFetching: isFetchingItems,
    errors: itemErrors
  } = useItemsFromPages(pageData?.pages ?? [], dereferenceItems);

  const allErrors = arrayOf(collectionError).concat(arrayOf(itemErrors));

  const addItem = useCallback(
    (item: string | any, shouldRefetch: boolean | number = true) => {
      queryClient.setQueryData(['collection', { collectionUrl }], (oldData: any) => {
        if (!oldData) return oldData;
        setTotalItems(totalItems && totalItems + 1);

        // Destructure, so react knows, it needs to re-render the pages.
        const pages = [...oldData.pages];
        const firstPageItems: any[] = pages?.[0]?.orderedItems || pages?.[0]?.items || [];
        firstPageItems.unshift(item);

        oldData.pages = pages;
        return oldData;
      });
      if (shouldRefetch) {
        setTimeout(
          () =>
            queryClient.refetchQueries(['collection', { collectionUrl }], {
              active: true,
              exact: true
            }),
          typeof shouldRefetch === 'number' ? shouldRefetch : 2000
        );
      }
    },
    [queryClient, collectionUrl]
  );

  const removeItem = useCallback(
    (item: string | any, shouldRefetch: boolean = true) => {
      queryClient.setQueryData(['collection', { collectionUrl }], (oldData: any) => {
        if (!oldData) return oldData;
        setTotalItems(totalItems && totalItems - 1);

        // Destructure, so react knows, it needs to re-render the pages array.
        const pages = [...oldData.pages];
        // Find the item in all pages and remove the item to be removed (either item.id or just item)
        pages.forEach(page => {
          if (page.orderedItems) {
            page.orderedItems = page.orderedItems.filter((i: any) => (i.id || i) !== (item.id || item));
          } else if (page.items) {
            page.items = page.items.filter((i: any) => (i.id || i) !== (item?.id || item));
          }
        });

        oldData.pages = pages;
        return oldData;
      });
      if (shouldRefetch) {
        setTimeout(
          () =>
            queryClient.refetchQueries(['collection', { collectionUrl }], {
              active: true,
              exact: true
            }),
          typeof shouldRefetch === 'number' ? shouldRefetch : 2000
        );
      }
    },
    [queryClient, collectionUrl]
  );

  // Live Updates
  useEffect(() => {
    if (liveUpdates && collectionUrl) {
      // Create ws that listens to collectionUri changes
      getOrCreateWsChannel(dataProvider.fetch, collectionUrl)
        .then(webSocket => {
          webSocket.addEventListener('message', e => {
            const data: SolidNotification = JSON.parse(e.data);
            if (data.type === 'Add') {
              addItem(data.object, true);
            } else if (data.type === 'Remove') {
              removeItem(data.object, true);
            }
          });
          webSocket.addEventListener('error', e => {
            setHasLiveUpdates({ status: 'error', error: e });
            // TODO: Retry after a while
          });
          webSocket.addEventListener('close', e => {
            if (!hasLiveUpdates.error) {
              setHasLiveUpdates({ ...hasLiveUpdates, status: 'closed' });
            }
          });
          setHasLiveUpdates({ status: 'connected', webSocket });
        })
        .catch(() => {}); // If it fails, we won't receive live updates. But that's okay.
    }
  }, [collectionUrl, liveUpdates, dataProvider]);

  return {
    items,
    totalItems,
    error: allErrors.length > 0 && allErrors,
    refetch,
    fetchNextPage,
    addItem,
    removeItem,
    hasNextPage,
    isLoading: isLoadingPage || isLoadingItems,
    isFetching: isFetchingPage || isFetchingItems,
    isFetchingNextPage,
    url: collectionUrl,
    hasLiveUpdates
  };
};

export default useCollection;
