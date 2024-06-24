import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { useInfiniteQuery, useQueries } from 'react-query';
import { getOrCreateWsChannel } from '@semapps/semantic-data-provider';
import { arrayOf } from '../utils';

const useItemsFromPagesAndNotifications = (pages, notifications, dereferenceItems) => {
  const dataProvider = useDataProvider();

  // Add all items from pages and process notifications (possibly new and deleted items).
  const items = useMemo(
    () => {
      const addItems = notifications.map(n => n.type === 'Add').map(n => n.object);
      const removeItems = notifications.map(n => n.type === 'Remove').map(n => n.object.id || n.object);
      const currentItems = !pages ? [] : pages.flatMap(p => arrayOf(p.orderedItems || p.items));
      const currentAndNew = currentItems.concat(addItems);

      return (
        currentAndNew
          // Filter out removed items.
          .filter(item => !removeItems.some(r => (r.id ?? r) === (item.id ?? item)))
          // Filter duplicates.
          .filter(item => currentAndNew.some(i2 => (i2.id ?? i2) === (item.id ?? item)))
      );
    },
    pages,
    notifications
  );

  if (!dereferenceItems) {
    return { loadedItems: items, isLoading: false, isFetching: false };
  }

  // Dereference all items, if they are not yet.
  const itemQueries = useQueries(
    items
      .filter(item => typeof item === 'string')
      .map(itemUri => ({
        queryKey: ['resource', itemUri],
        queryFn: async () => (await dataProvider.fetch(itemUri)).json,
        staleTime: Infinity
      }))
  );

  // Put all loaded items together (might be dereferenced already, so concatenate).
  const loadedItems = items
    .filter(item => typeof item !== 'string')
    .concat(
      itemQueries.flatMap(itemQuery => {
        return (itemQuery.isSuccess && itemQuery.data) || [];
      })
    );

  console.log('loadedItems', loadedItems.length, 'total', items.length);

  const errors = itemQueries.filter(q => q.error);
  return {
    loadedItems,
    isLoading: itemQueries.some(q => q.isLoading),
    isFetching: itemQueries.some(q => q.isFetching),
    errors: errors.length > 0 && errors
  };
};

const useCollection = (predicateOrUrl, options = {}) => {
  const { dereferenceItems = false, liveUpdates = true } = options;
  const { data: identity } = useGetIdentity();
  const [totalItems, setTotalItems] = useState();
  const [notifications, setNotifications] = useState([]);
  const [hasLiveUpdates, setHasLiveUpdates] = useState({ status: 'disconnected', error: undefined });
  const dataProvider = useDataProvider();

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
  const fetchCollection = useCallback(
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
    data,
    error: collectionError,
    fetchNextPage,
    refetch,
    hasNextPage,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
    isFetchingNextPage
  } = useInfiniteQuery(['collection', { collectionUrl }], fetchCollection, {
    enabled: !!(collectionUrl && identity?.id),
    getNextPageParam: lastPage => lastPage.next,
    getPreviousPageParam: firstPage => firstPage.prev
  });

  // Put all items together in a list.
  const {
    loadedItems: items,
    isLoading: isLoadingItems,
    isFetching: isFetchingItems,
    errors: itemErrors
  } = useItemsFromPagesAndNotifications(data?.pages, notifications, dereferenceItems);
  // Notifications have been processed after hook call, so reset.
  // useEffect(() => {
  //   setNotifications([]);
  // }, [notifications])

  // Live Updates
  useEffect(() => {
    if (liveUpdates && collectionUrl) {
      // Create ws that listens to collectionUri changes
      getOrCreateWsChannel(dataProvider.fetch, collectionUrl)
        .then(webSocket => {
          webSocket.addEventListener('message', e => {
            if ((e.data && e.data.type === 'Add') || e.data.type === 'Remove') {
              setNotifications([...notifications, e.data]);
            }
          });
          webSocket.addEventListener('error', e => {
            setHasLiveUpdates({ status: 'error', error: e });
            // TODO: Retry after a while
          });
          webSocket.addEventListener('close', e => {
            setHasLiveUpdates({ ...hasLiveUpdates, status: 'disconnected' });
          });
          setHasLiveUpdates({ status: 'connected' });
        })
        .catch(() => {}); // If it fails, we won't receive live updates. But that's okay.
    }
  }, [collectionUrl, liveUpdates, dataProvider.fetch]);

  const allErrors = arrayOf(collectionError).concat(arrayOf(itemErrors));

  return {
    items,
    totalItems,
    error: allErrors.length > 0 && allErrors,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingPage || isLoadingItems,
    isFetching: isFetchingPage || isFetchingItems,
    isFetchingNextPage,
    url: collectionUrl,
    hasLiveUpdates
  };
};

export default useCollection;
