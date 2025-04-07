import { useCallback, useMemo, useState, useEffect, useRef, RefObject } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { QueryFunction, useInfiniteQuery, useQueries, useQueryClient } from 'react-query';
import { getOrCreateWsChannel, SemanticDataProvider } from '@semapps/semantic-data-provider';
import { arrayOf } from '../utils';
import type { UseCollectionOptions, SolidNotification, AwaitActivityOptions } from '../types';
import { getShaclValidator, validateItems } from '../utils/shaclValidation';

// Used to avoid re-renders
const emptyArray: never[] = [];

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
      ? emptyArray
      : items
          .filter(item => typeof item === 'string')
          .map(itemUri => ({
            queryKey: ['resource', itemUri],
            queryFn: async () => (await dataProvider.fetch(itemUri)).json,
            staleTime: Infinity // Activities are immutable, so no need to refetch..
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
 * @param {UseCollectionOptions} options Defaults to `{ dereferenceItems: false, liveUpdates: false }`
 */
const useCollection = (predicateOrUrl: string, options: UseCollectionOptions = {}) => {
  const { dereferenceItems = false, liveUpdates = false, shaclShapeUri = '' } = options;
  const { data: identity } = useGetIdentity();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isPaginated, setIsPaginated] = useState<boolean>(false); // true if the collection is paginated
  const [yieldsTotalItems, setYieldsTotalItems] = useState<boolean>(false); // true if the collection server yields totalItems
  const queryClient = useQueryClient();
  const [hasLiveUpdates, setHasLiveUpdates] = useState<{ status: string; error?: any }>({
    status: 'connecting'
  });
  const dataProvider = useDataProvider<SemanticDataProvider>();
  const webSocketRef = useRef<WebSocket | null>(null);

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
      // If there is a nextPageUrl, we are fetching a page, otherwise we are fetching the first page or the collection
      const fetchingPage: boolean = !!nextPageUrl;
      // Fetch page or first page (collectionUrl)
      let { json } = await dataProvider.fetch(nextPageUrl || collectionUrl);

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
      const itemsKey = json.orderedItems ? 'orderedItems' : 'items';

      // If we are fetching the first page or the collection, we can workout some information
      if (!fetchingPage) {
        const localIsPaginated = !!json.first || !!json.next;
        setIsPaginated(localIsPaginated);

        // If the server yields totalItems, we can use it
        if (json.totalItems) {
          setTotalItems(json.totalItems);
          setYieldsTotalItems(true);
        } else if (!localIsPaginated) {
          // If the collection is not paginated, we can count items
          const items = arrayOf(json[itemsKey]);
          if (items) setTotalItems(items.length);
        }
      }

      // Validate the json with the SHACL shape
      if (shaclShapeUri !== '' && json[itemsKey] && json[itemsKey].length > 0) {
        try {
          if (!json['@context']) {
            throw new Error(
              `No context returned by the server.\nA context is required to expand the collection's items and validate them.`
            );
          }
          const shaclValidator = await getShaclValidator(shaclShapeUri);
          const validatedResults = await validateItems(arrayOf(json[itemsKey]), shaclValidator, json['@context']);

          // Keep only the valid item in the collection
          json[itemsKey] = validatedResults.filter(result => result.isValid).map(result => result.item);
        } catch (error) {
          console.warn(
            `Filtering of the collection's items using SHACL validation wasn't possible.\n${collectionUrl}`,
            error
          );
        }
      }

      return json;
    },
    [dataProvider, collectionUrl, identity, setTotalItems, setIsPaginated, setYieldsTotalItems, shaclShapeUri]
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
  } = useInfiniteQuery(['collection', { collectionUrl, shaclShapeUri }], fetchCollection, {
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
  } = useItemsFromPages(pageData?.pages ?? emptyArray, dereferenceItems);

  const allErrors = arrayOf(collectionError).concat(arrayOf(itemErrors));

  const addItem = useCallback(
    (item: string | any, shouldRefetch: boolean | number = true) => {
      queryClient.setQueryData(['collection', { collectionUrl }], (oldData: any) => {
        if (!oldData) return oldData;

        // Only update totalItems if collection is not paginated or if the server yields totalItems
        if (yieldsTotalItems || !isPaginated) {
          setTotalItems(totalItems => totalItems + 1);
        }

        // Destructure, so react knows, it needs to re-render the pages.
        const pages = [...oldData.pages];

        if (pages?.[0]?.orderedItems) {
          pages[0].orderedItems = [item, ...arrayOf(pages[0].orderedItems)];
        } else if (pages?.[0]?.items) {
          pages[0].items = [item, ...arrayOf(pages[0].items)];
        }

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
    [queryClient, collectionUrl, setTotalItems, isPaginated, yieldsTotalItems]
  );

  const removeItem = useCallback(
    (item: string | any, shouldRefetch: boolean = true) => {
      queryClient.setQueryData(['collection', { collectionUrl }], (oldData: any) => {
        if (!oldData) return oldData;

        // Only update totalItems if collection is not paginated or if the server yields totalItems
        if (yieldsTotalItems || !isPaginated) {
          setTotalItems(totalItems => totalItems - 1);
        }

        // Destructure, so react knows, it needs to re-render the pages array.
        const pages = [...oldData.pages];
        // Find the item in all pages and remove the item to be removed (either item.id or just item)
        pages.forEach(page => {
          if (page.orderedItems) {
            page.orderedItems = arrayOf(page.orderedItems).filter((i: any) => (i.id || i) !== (item.id || item));
          } else if (page.items) {
            page.items = arrayOf(page.items).filter((i: any) => (i.id || i) !== (item?.id || item));
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
    [queryClient, collectionUrl, setTotalItems, isPaginated, yieldsTotalItems]
  );

  // Live Updates
  useEffect(() => {
    if (liveUpdates && collectionUrl) {
      // Create ws that listens to collectionUri changes
      getOrCreateWsChannel(dataProvider.fetch, collectionUrl)
        .then(ws => {
          webSocketRef.current = ws; // Keep a ref to the webSocket so that it can be used elsewhere
          webSocketRef.current.addEventListener('message', e => {
            const data: SolidNotification = JSON.parse(e.data);
            if (data.type === 'Add') {
              addItem(data.object, true);
            } else if (data.type === 'Remove') {
              removeItem(data.object, true);
            }
          });
          webSocketRef.current.addEventListener('error', e => {
            setHasLiveUpdates({ status: 'error', error: e });
            // TODO: Retry after a while
          });
          webSocketRef.current.addEventListener('close', e => {
            if (!hasLiveUpdates.error) {
              setHasLiveUpdates({ ...hasLiveUpdates, status: 'closed' });
            }
          });
          setHasLiveUpdates({ status: 'connected' });
        })
        .catch(() => {}); // If it fails, we won't receive live updates. But that's okay.
    }
  }, [collectionUrl, liveUpdates, dataProvider, webSocketRef, addItem, removeItem, setHasLiveUpdates]);

  const awaitWebSocketConnection = useCallback(
    (options: AwaitActivityOptions = {}): Promise<RefObject<WebSocket>> => {
      const { timeout = 30000 } = options;
      if (!liveUpdates)
        throw new Error(`Cannot call awaitWebSocketConnection because the liveUpdates option is set to false`);
      return new Promise((resolve, reject) => {
        if (webSocketRef?.current) {
          resolve(webSocketRef);
        } else {
          const timeoutId = setTimeout(() => {
            reject(`No WebSocket connection found within ${Math.round(timeout / 1000)}s`);
          }, timeout);
          const intervalId = setInterval(() => {
            if (webSocketRef?.current) {
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              resolve(webSocketRef);
            } else {
              console.log('WebSocket is not initialized yet, waiting...');
            }
          }, 100);
        }
      });
    },
    [webSocketRef, liveUpdates]
  );

  // Construct return object conditionally
  const returnObject = {
    items,
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
    hasLiveUpdates,
    awaitWebSocketConnection,
    webSocketRef
  };

  // Only include totalItems if the server yields totalItems or for non-paginated collections
  if (yieldsTotalItems || !isPaginated) {
    return { ...returnObject, totalItems };
  }

  return returnObject;
};

export default useCollection;
