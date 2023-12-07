import { useEffect } from 'react';
import { usePermissions, useRedirect, useNotify } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';

const useCheckPermissions = (uri, mode, redirectUrl = '/') => {
  const { permissions } = usePermissions(uri);
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (permissions && !permissions.some(p => rights[mode].includes(p['acl:mode']))) {
      notify(forbiddenErrors[mode], { type: 'error' });
      redirect(redirectUrl);
    }
  }, [permissions, redirect, notify]);

  return permissions;
};

export default useCheckPermissions;
