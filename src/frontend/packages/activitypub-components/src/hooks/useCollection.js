import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGetIdentity, fetchUtils } from 'react-admin';

const useCollection = (predicateOrUri) => {
  const { identity } = useGetIdentity();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const collectionUri = useMemo(() => {
    if (predicateOrUri) {
      if (predicateOrUri.startsWith('http')) {
        return predicateOrUri;
      } else if (identity?.webIdData) {
        return identity?.webIdData?.[predicateOrUri];
      }
    }
  }, [identity, predicateOrUri]);

  const fetch = useCallback(async () => {
    if (!collectionUri) return;

    setLoading(true);
    const headers = new Headers({
      Accept: 'application/ld+json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    fetchUtils
      .fetchJson(collectionUri, { headers })
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
  }, [setItems, setLoaded, setLoading, setError, collectionUri]);

  useEffect(() => {
    if (!loading && !loaded && !error) {
      fetch();
    }
  }, [fetch, loading, loaded, error]);

  return { items, loading, loaded, error, refetch: fetch, url: collectionUri, owner: identity?.id };
};

export default useCollection;
