import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { arrayOf } from '../utils';

const useCollection = (predicateOrUrl, options = {}) => {
  const { dereferenceItems = false } = options;
  const { data: identity } = useGetIdentity();
  const [items, setItems] = useState();
  const [totalItems, setTotalItems] = useState();
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  const collectionUrl = useMemo(() => {
    if (predicateOrUrl) {
      if (predicateOrUrl.startsWith('http')) {
        return predicateOrUrl;
      }
      if (identity?.webIdData) {
        return identity?.webIdData?.[predicateOrUrl];
      }
    }
  }, [identity, predicateOrUrl]);

  const fetchCollection = useCallback(
    async ({ pageParam: nextPageUrl }) => {
      let { json } = await dataProvider.fetch(nextPageUrl || collectionUrl);
      if (json.totalItems) setTotalItems(json.totalItems);

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

      // Force dereference of items
      if (dereferenceItems) {
        const itemPredicate = json.items ? 'items' : 'orderedItems';
        json[itemPredicate] =
          json[itemPredicate] &&
          (await Promise.all(
            arrayOf(json[itemPredicate]).map(async item => {
              if (typeof item === 'string') {
                const { json } = await dataProvider.fetch(item);
                return json;
              }
              return item;
            })
          ));
      }

      return json;
    },
    [dataProvider, collectionUrl, identity, setTotalItems]
  );

  const { data, error, fetchNextPage, refetch, hasNextPage, isLoading, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['Collection', { collectionUrl }], fetchCollection, {
      enabled: !!(collectionUrl && identity?.id),
      getNextPageParam: lastPage => lastPage.next,
      getPreviousPageParam: firstPage => firstPage.prev
    });

  useEffect(() => {
    if (data?.pages) {
      setItems([].concat(...data.pages.map(p => arrayOf(p.orderedItems || p.items))));
    }
  }, [data, setItems]);

  const addItem = useCallback(
    item => {
      setItems(oldItems => [...oldItems, item]);
      // TODO use queryClient.setQueryData to update items directly in react-query cache
      setTimeout(
        () =>
          queryClient.refetchQueries(['Collection', { collectionUrl }], {
            active: true,
            exact: true
          }),
        2000
      );
    },
    [setItems, queryClient, collectionUrl]
  );

  const removeItem = useCallback(
    itemId => {
      setItems(oldItems => oldItems.filter(item => (typeof item === 'string' ? item !== itemId : item.id !== itemId)));
      // TODO use queryClient.setQueryData to update items directly in react-query cache
      setTimeout(
        () =>
          queryClient.refetchQueries(['Collection', { collectionUrl }], {
            active: true,
            exact: true
          }),
        2000
      );
    },
    [setItems, queryClient, collectionUrl]
  );

  return {
    items,
    totalItems,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
    addItem,
    removeItem,
    url: collectionUrl
  };
};

export default useCollection;
