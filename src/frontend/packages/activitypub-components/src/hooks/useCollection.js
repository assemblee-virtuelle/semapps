import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, useDataProvider } from 'react-admin';
import { arrayOf } from '../utils';

const useCollection = predicateOrUrl => {
  const { data: identity, isLoading: identityLoading } = useGetIdentity();
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
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

  const fetch = useCallback(async () => {
    setLoading(true);

    const headers = new Headers({ Accept: 'application/ld+json' });

    // Add authorization token if it is set and if the user is on the same server as the collection
    const identityOrigin = identity.id && new URL(identity.id).origin;
    const collectionOrigin = new URL(collectionUrl).origin;
    const token = localStorage.getItem('token');
    if (identityOrigin === collectionOrigin && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    dataProvider
      .fetch(collectionUrl, { headers })
      .then(({ json }) => {
        // If pagination is activated, load the first page
        if (json.type === 'OrderedCollection' && json.first) {
          return dataProvider.fetch(json.first, { headers });
        }
        return { json };
      })
      .then(({ json }) => {
        if (json && json.items) {
          setItems(arrayOf(json.items));
        } else if (json && json.orderedItems) {
          setItems(arrayOf(json.orderedItems));
        } else {
          setItems([]);
        }
        setTotalItems(json.totalItems);
        setError(false);
        setLoaded(true);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
        setLoading(false);
      });
  }, [setItems, setTotalItems, setLoaded, setLoading, setError, collectionUrl, identity, dataProvider]);

  useEffect(() => {
    if (collectionUrl && !identityLoading && !loading && !loaded && !error) {
      fetch();
    }
  }, [fetch, collectionUrl, identityLoading, loading, loaded, error]);

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

  return { items, totalItems, loading, loaded, error, refetch: fetch, addItem, removeItem, url: collectionUrl };
};

export default useCollection;
