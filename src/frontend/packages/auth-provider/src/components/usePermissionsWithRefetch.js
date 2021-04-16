import { useEffect, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { useGetPermissions, useSafeSetState } from 'react-admin';

const emptyParams = {};

// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const alreadyFetchedPermissions = { '{}': undefined };

// Fork of usePermissionsOptimized, with a refetch option
const usePermissionsWithRefetch = (params = emptyParams) => {
  const key = JSON.stringify(params);
  const [state, setState] = useSafeSetState({
    permissions: alreadyFetchedPermissions[key]
  });
  const getPermissions = useGetPermissions();

  const fetchPermissions = useCallback(
    () =>
      getPermissions(params)
        .then(permissions => {
          if (!isEqual(permissions, state.permissions)) {
            alreadyFetchedPermissions[key] = permissions;
            setState({ permissions });
          }
        })
        .catch(error => {
          setState({
            error
          });
        }),
    [key, params, getPermissions]
  );

  useEffect(() => {
    fetchPermissions();
  }, [key]);

  return { ...state, refetch: fetchPermissions };
};

export default usePermissionsWithRefetch;
