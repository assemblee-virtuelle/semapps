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
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    permissions: alreadyFetchedPermissions[key]
  });
  const getPermissions = useGetPermissions();

  const fetchPermissions = useCallback(
    () =>
      getPermissions(params)
        .then(permissions => {
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          if (!isEqual(permissions, state.permissions)) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            alreadyFetchedPermissions[key] = permissions;
            setState({ permissions });
          }
        })
        .catch(error => {
          setState({
            // @ts-expect-error TS(2345): Argument of type '{ error: any; }' is not assignab... Remove this comment to see the full error message
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
