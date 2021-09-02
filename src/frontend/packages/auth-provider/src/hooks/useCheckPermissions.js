import React, { useEffect } from 'react';
import { usePermissionsOptimized, useRedirect, useNotify, useGetIdentity } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';
import useCheckAuthenticated from "./useCheckAuthenticated";

const useCheckPermissions = (resourceId, mode, redirectUrl = '/') => {
  const { identity } = useCheckAuthenticated();
  const { permissions } = usePermissionsOptimized(resourceId);
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (identity?.id && permissions && !permissions.some(p => rights[mode].includes(p['acl:mode']))) {
      notify(forbiddenErrors[mode], 'error');
      redirect(redirectUrl);
    }
  }, [permissions, identity, redirect, notify]);

  return permissions;
};

export default useCheckPermissions;
