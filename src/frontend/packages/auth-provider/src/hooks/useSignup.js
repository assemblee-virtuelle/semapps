import { useCallback } from 'react';
import { useAuthProvider } from 'react-admin';

const useSignup = () => {
  const authProvider = useAuthProvider();

  return useCallback((params = {}) => authProvider.signup(params), [authProvider]);
};

export default useSignup;
