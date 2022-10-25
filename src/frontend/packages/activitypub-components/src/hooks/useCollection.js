import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';

const useCollection = predicateOrUrl => {
  const { identity } = useGetIdentity();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const collectionUrl = useMemo(() => {
    if (predicateOrUrl) {
      if (predicateOrUrl.startsWith('http')) {
        return predicateOrUrl;
      } else if (identity?.webIdData) {
        return identity?.webIdData?.[predicateOrUrl];
      }
    }
  }, [identity, predicateOrUrl]);

  const fetch = useCallback(async () => {
    if (!collectionUrl) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = new Headers({
      Accept: 'application/ld+json',
      Authorization: token ? `Bearer ${token}` : undefined
    });

    fetchUtils
      .fetchJson(collectionUrl, { headers })
      .then(({ json }) => {
        if (json && json.items) {
          setItems(json.items);
        } else if (json && json.orderedItems) {
          setItems(json.orderedItems);
        } else {
          setItems([]);
        }
        setError(false);
        setLoaded(true);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
        setLoading(false);
      });
  }, [setItems, setLoaded, setLoading, setError, collectionUrl]);

  useEffect(() => {
    if (!loading && !loaded && !error) {
      fetch();
    }
  }, [fetch, loading, loaded, error]);

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

  return { items, loading, loaded, error, refetch: fetch, addItem, removeItem, url: collectionUrl };
};

export default useCollection;
