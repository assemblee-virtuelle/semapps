import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const initialValues = { data: null, loading: true, error: null };

const useQuery = (uri, { cacheOnly, headers, ...fetchOptions } = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => state.queries[uri]);

  const callFetch = () => {
    if (!cachedQuery) {
      dispatch({ type: 'QUERY_TRIGGER', uri });
      fetch(uri, {
        method: 'GET',
        headers: {
          Accept: 'application/ld+json',
          ...headers
        },
        ...fetchOptions
      })
        .then(response => response.json())
        .then(data => {
          dispatch({ type: 'QUERY_SUCCESS', uri, data });
        })
        .catch(error => {
          dispatch({ type: 'QUERY_FAILURE', uri, error: error.message });
        });
    }
  };

  useEffect(() => {
    if (cacheOnly !== true) callFetch();
  }, [uri, cacheOnly, callFetch]);

  return { ...initialValues, ...cachedQuery, retry: callFetch };
};

export default useQuery;
