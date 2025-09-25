import { useCallback } from 'react';
import { useAuthProvider } from 'react-admin';

const useSignup = () => {
  const authProvider = useAuthProvider();

  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  return useCallback((params = {}) => authProvider.signup(params), [authProvider]);
};

export default useSignup;
