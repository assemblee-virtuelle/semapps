import React, { useEffect } from 'react';
import { useGetIdentity, useNotify, useRedirect } from 'react-admin';

const useCheckAuthenticated = () => {
  const { identity, loading } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (!loading && !identity?.id) {
      notify('ra.auth.auth_check_error', 'error');
      redirect('/login');
    }
  }, [loading, identity, redirect, notify]);

  return { identity, loading };
}

export default useCheckAuthenticated;
