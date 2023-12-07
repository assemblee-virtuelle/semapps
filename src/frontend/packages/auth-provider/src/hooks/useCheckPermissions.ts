import { useEffect } from 'react';
import { usePermissions, useRedirect, useNotify } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';
import { Permissions } from '../types';

const useCheckPermissions = (uri: string, mode: keyof typeof rights, redirectUrl: string = '/') => {
  const { permissions } = usePermissions<Permissions | undefined>(uri);
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
