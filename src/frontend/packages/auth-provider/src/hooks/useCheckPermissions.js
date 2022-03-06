import React, { useEffect } from 'react';
import { usePermissionsOptimized, useRedirect, useNotify, useGetIdentity } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';
import useCheckAuthenticated from './useCheckAuthenticated';

const useCheckPermissions = (uri, mode, redirectUrl = '/') => {
  const { identity, loading } = useGetIdentity();
  const { permissions } = usePermissionsOptimized(uri);
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (!loading && identity && permissions && !permissions.some(p => rights[mode].includes(p['acl:mode']))) {
      notify(forbiddenErrors[mode], 'error');
      redirect(redirectUrl);
    }
  }, [permissions, identity, redirect, notify, loading]);

  return permissions;
};

export default useCheckPermissions;
