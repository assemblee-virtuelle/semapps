import { login, logout, getDefaultSession, handleIncomingRedirect, fetch } from '@inrupt/solid-client-authn-browser';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import { AuthProvider, UserIdentity } from 'react-admin';

interface SolidAuthProviderSettings {
  dataProvider: SemanticDataProvider;
  allowAnonymous?: boolean;
  checkUser?: (userData: any) => boolean;
  clientId: string;
  clientName: string;
}

const solidAuthProvider = ({
  dataProvider,
  allowAnonymous = true,
  checkUser,
  clientId,
  clientName
}: SolidAuthProviderSettings): AuthProvider => ({
  login: async (params: any) => {
    let { webId, issuer, redirect = '/', isSignup = false } = params;

    // if (webId && !issuer) {
    //   // Find issuer from webId
    //   const { json: userData } = await dataProvider.fetch(webId);
    //   if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
    //   if (!userData['solid:oidcIssuer']) throw new Error('auth.message.no_associated_oidc_issuer');
    //   issuer = userData?.['solid:oidcIssuer'];
    // }

    localStorage.setItem('redirect', redirect);

    await login({
      oidcIssuer: issuer,
      redirectUrl: `${window.location.origin}/auth-callback`,
      clientName
      // customScopes: ['openid', 'webid', 'offline_access']
    });
  },
  handleCallback: async () => {
    const redirect = localStorage.getItem('redirect');

    // Remove we don't need it anymore
    localStorage.removeItem('redirect');

    await handleIncomingRedirect();

    // Reload to ensure the dataServer config is reset
    window.location.href = redirect || '/';
  },
  signup: async (params: any) => {
    // Not implemented ?
  },
  logout: async (params: any) => {
    const { redirectUrl }: { redirectUrl: string } = params || {};

    await logout({ logoutType: 'idp', postLogoutUrl: redirectUrl });
  },
  checkAuth: async () => {
    const isLogged = !getDefaultSession().info.isLoggedIn;
    if (!isLogged && !allowAnonymous) throw new Error();
  },
  checkUser: (userData: any) => {
    if (checkUser) {
      return checkUser(userData);
    }
    return true;
  },
  checkError: (error: any) => {
    // We want to disconnect only with INVALID_TOKEN errors
    if (error.status === 401 && error.body && error.body.type === 'INVALID_TOKEN') {
      localStorage.removeItem('token');
      return Promise.reject();
    } else {
      // Other error code (404, 500, etc): no need to log out
      return Promise.resolve();
    }
  },
  getIdentity: async (): Promise<UserIdentity> => {
    let { webId } = getDefaultSession().info;
    let webIdData: any = {};
    let profileData: any = {};

    if (webId) {
      const response = await fetch(webId, { headers: new Headers({ 'Content-Type': 'application/ld+json' }) });
      webIdData = await response.json();

      if (webIdData.url) {
        const response = await fetch(webIdData.url, {
          headers: new Headers({ 'Content-Type': 'application/ld+json' })
        });
        profileData = await response.json();
      }
    }

    return {
      id: webId,
      fullName:
        profileData['vcard:given-name'] ||
        profileData['pair:label'] ||
        webIdData['foaf:name'] ||
        webIdData['pair:label'],
      avatar:
        profileData['vcard:photo'] || webIdData.image?.url || webIdData.image || webIdData.icon?.url || webIdData.icon,
      profileData,
      webIdData
    };
  }
});

export default solidAuthProvider;
