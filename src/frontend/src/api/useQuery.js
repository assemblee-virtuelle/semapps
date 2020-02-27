import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const initialValues = { data: null, body: null, loading: true, error: null };

const useQuery = (uri, options = { cacheOnly: false }) => {
  const dispatch = useDispatch();
  const cachedQuery = useSelector(state => {
    // provide data coresponding to Uri
    // if options contains body, return data only if body is the same
    let resource = state.api.queries[uri];
    if (!options.body) {
      return resource;
    } else if (resource && resource.body === options.body) {
      return resource;
    } else {
      return undefined;
    }
  });

  const callFetch = useCallback(() => {
    let { cacheOnly, headers, body, method, onlyArray, ...fetchOptions } = options;
    const validRequest =
      uri !== undefined &&
      (options.method !== undefined && options.method === 'POST' ? options.body !== undefined : true);
    if (validRequest && !cachedQuery) {
      dispatch({ type: 'QUERY_TRIGGER', uri, body: options.body });
      headers = {
        Accept: 'application/ld+json',
        ...headers
      };
      const token = localStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;

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
          dispatch({ type: 'QUERY_SUCCESS', uri, data, onlyArray, body });
        })
        .catch(error => {
          dispatch({ type: 'QUERY_FAILURE', uri, body: options.body, error: error.message });
        });
    }
  }, [uri, options, dispatch, cachedQuery]);

  useEffect(() => {
    if (options.cacheOnly !== true) callFetch();
  }, [uri, options, callFetch]);
  return { ...initialValues, ...cachedQuery, retry: callFetch };
};

export default useQuery;
