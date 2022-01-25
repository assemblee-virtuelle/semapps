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
    const headers = new Headers({
      Accept: 'application/ld+json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });

    fetchUtils
      .fetchJson(collectionUrl, { headers })
      .then(({ json }) => {
        if (json && json.items) {
          setItems(json.items);
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

  return { items, loading, loaded, error, refetch: fetch, url: collectionUrl };
};

export default useCollection;
