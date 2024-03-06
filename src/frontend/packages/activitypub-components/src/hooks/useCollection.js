import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { useInfiniteQuery } from 'react-query';

const useCollection = predicateOrUrl => {
  const { data: identity } = useGetIdentity();
  const [items, setItems] = useState();
  const [totalItems, setTotalItems] = useState();
  const dataProvider = useDataProvider();

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

      if (json.type === 'OrderedCollection' && json.first) {
        // Fetch the first page
        ({ json } = await dataProvider.fetch(json.first));
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
      setItems([].concat(...data.pages.map(p => p.orderedItems || p.items)));
    }
  }, [data, setItems]);

  const addItem = useCallback(
    item => {
      setItems(oldItems => [...oldItems, item]);
    },
    [setItems]
  );

  const removeItem = useCallback(
    itemId => {
      setItems(oldItems => oldItems.filter(item => (typeof item === 'string' ? item !== itemId : item.id !== itemId)));
    },
    [setItems]
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
