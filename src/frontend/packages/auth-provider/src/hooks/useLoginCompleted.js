import { useCallback } from 'react';
import urlJoin from 'url-join';
import { useDataProvider } from 'react-admin';
import { getAuthServerUrl } from '../utils';

// Call a custom endpoint to tell the OIDC server the login is completed
const useLoginCompleted = () => {
  const dataProvider = useDataProvider();

  return useCallback(async interactionId => {
    const authServerUrl = await getAuthServerUrl(dataProvider);
    console.log('login completed', authServerUrl, interactionId);
    await dataProvider.fetch(urlJoin(authServerUrl, '.oidc/login-completed'), {
      method: 'POST',
      body: JSON.stringify({ interactionId }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
  });
};

export default useLoginCompleted;
