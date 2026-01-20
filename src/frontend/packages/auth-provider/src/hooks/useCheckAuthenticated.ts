import { useEffect } from 'react';
import { useGetIdentity, useNotify, useRedirect } from 'react-admin';
import { useLocation } from 'react-router-dom';

const useCheckAuthenticated = (message: any) => {
  const { data: identity, isLoading } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !identity?.id) {
      notify(message || 'ra.auth.auth_check_error', { type: 'error' });
      redirect(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [isLoading, identity, redirect, notify, location]);

  return { identity, isLoading };
};

export default useCheckAuthenticated;
