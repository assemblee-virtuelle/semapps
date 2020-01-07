import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const initialValues = { data: null, loading: true, error: null };

const useQuery = (endpoint, { cacheOnly, headers, ...fetchOptions } = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => state.queries[endpoint]);

  const callFetch = () => {
    if (!cachedQuery) {
      dispatch({ type: 'QUERY_TRIGGER', endpoint });
      fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/ld+json',
          ...headers
        },
        ...fetchOptions
      })
        .then(response => response.json())
        .then(data => {
          dispatch({ type: 'QUERY_SUCCESS', endpoint, data });
        })
        .catch(error => {
          dispatch({ type: 'QUERY_FAILURE', endpoint, error: error.message });
        });
    }
  };

  useEffect(() => {
    if (cacheOnly !== true) callFetch();
  }, [endpoint, cacheOnly, callFetch]);

  return { ...initialValues, ...cachedQuery, retry: callFetch };
};

export default useQuery;
