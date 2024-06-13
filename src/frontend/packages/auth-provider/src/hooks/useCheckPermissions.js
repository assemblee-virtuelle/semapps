import { useEffect } from 'react';
import { usePermissions, useRedirect, useNotify, useGetIdentity } from 'react-admin';
import { rights, forbiddenErrors } from '../constants';

const useCheckPermissions = (uri, mode, redirectUrl = '/') => {
  const { data: identity, isLoading } = useGetIdentity();
  const { permissions } = usePermissions(uri);
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (!isLoading && identity && permissions && !permissions.some(p => rights[mode].includes(p['acl:mode']))) {
      notify(forbiddenErrors[mode], { type: 'error' });
      redirect(redirectUrl);
    }
  }, [permissions, identity, redirect, notify, isLoading]);

  return permissions;
};

export default useCheckPermissions;
