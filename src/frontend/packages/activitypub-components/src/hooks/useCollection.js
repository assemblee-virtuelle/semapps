import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';
import { arrayOf } from '../utils';

const useCollection = predicateOrUrl => {
  const { identity, loaded: identityLoaded } = useGetIdentity();
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

    const headers = new Headers({ Accept: 'application/ld+json' });

    // Add authorization token if it is set and if the user is on the same server as the collection
    const identityOrigin = identity?.id && (new URL(identity.id)).origin;
    const collectionOrigin = (new URL(collectionUrl)).origin;
    const token = localStorage.getItem('token');
    if (identityOrigin === collectionOrigin && token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    fetchUtils
      .fetchJson(collectionUrl, { headers })
      .then(({ json }) => {
        if (json && json.items) {
          setItems(arrayOf(json.items));
        } else if (json && json.orderedItems) {
          setItems(arrayOf(json.orderedItems));
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
  }, [setItems, setLoaded, setLoading, setError, collectionUrl, identity]);

  useEffect(() => {
    if (identityLoaded && !loading && !loaded && !error) {
      fetch();
    }
  }, [fetch, identityLoaded, loading, loaded, error]);

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
