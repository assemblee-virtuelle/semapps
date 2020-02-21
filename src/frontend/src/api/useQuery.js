import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const initialValues = { data: null, body: null, loading: true, error: null };

const useQuery = (uri, options = { cacheOnly: false }) => {
  // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => state.api.queries[uri]);

  const callFetch = useCallback(() => {
    let { cacheOnly, forceFetch, headers, body, method, onlyArray, ...fetchOptions } = options;

    if (!cachedQuery || (cachedQuery && cachedQuery.body != options.body)) {
      dispatch({ type: 'QUERY_TRIGGER', uri });
      headers = {
        Accept: 'application/ld+json',
        ...headers
      };
      const token = localStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;
      console.log('FETCH', uri, body);
      fetch(uri, {
        method: method || 'GET',
        headers,
        body,
        ...fetchOptions
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status, response.statusText);
          }
        })
        .then(data => {
          console.log('Good Way', data);
          dispatch({ type: 'QUERY_SUCCESS', uri, data, onlyArray, body });
        })
        .catch(error => {
          console.log(error);
          dispatch({ type: 'QUERY_FAILURE', uri, error: error.message });
        });
    }
  }, [uri, options]);

  useEffect(() => {
    // console.log('useEffect');
    if (options.cacheOnly !== true) callFetch();
  }, [options]);
  return { ...initialValues, ...cachedQuery, retry: callFetch };
};

export default useQuery;
