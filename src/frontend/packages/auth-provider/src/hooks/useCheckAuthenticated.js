import React, { useEffect } from 'react';
import { useGetIdentity, useNotify, useRedirect } from 'react-admin';
import { useLocation } from 'react-router-dom';

const useCheckAuthenticated = () => {
  const { identity, isLoading } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !identity?.id) {
      notify('ra.auth.auth_check_error', 'error');
      redirect('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
    }
  }, [isLoading, identity, redirect, notify, location]);

  return { identity, isLoading };
};

export default useCheckAuthenticated;
