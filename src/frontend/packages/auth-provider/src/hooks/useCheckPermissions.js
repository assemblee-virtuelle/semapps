import React, { useEffect } from 'react';
import { usePermissionsOptimized, useRedirect, useNotify } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';

const useCheckPermissions = (resourceId, mode, redirectUrl = '/') => {
  const { permissions } = usePermissionsOptimized(resourceId);
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (permissions && !permissions.some(p => rights[mode].includes(p['acl:mode']))) {
      notify(forbiddenErrors[mode], 'error');
      redirect(redirectUrl);
    }
  }, [permissions, redirect, notify]);

  return permissions;
};

export default useCheckPermissions;
