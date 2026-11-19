import jwtDecode from 'jwt-decode';
import * as oauth from 'oauth4webapi';
import { SemanticDataProvider } from '@semapps/semantic-data-provider';
import { AuthProvider, UserIdentity } from 'react-admin';

interface SolidAuthProviderSettings {
  dataProvider: SemanticDataProvider;
  allowAnonymous?: boolean;
  checkUser?: (userData: any) => boolean;
  clientId: string;
}

const solidAuthProvider = ({
  dataProvider,
  allowAnonymous = true,
  checkUser,
  clientId
}: SolidAuthProviderSettings): AuthProvider => ({
  login: async (params: any) => {
    let { webId, issuer, redirect = '/', isSignup = false } = params;

    if (webId && !issuer) {
      // Find issuer from webId
      const { json: userData } = await dataProvider.fetch(webId);
      if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
      if (!userData['solid:oidcIssuer']) throw new Error('auth.message.no_associated_oidc_issuer');
      issuer = userData?.['solid:oidcIssuer'];
    }

    const as = await oauth
      .discoveryRequest(new URL(issuer))
      .then(response => oauth.processDiscoveryResponse(new URL(issuer), response))
      .catch(() => {
        throw new Error('auth.message.unreachable_auth_server');
      });

    const codeVerifier = oauth.generateRandomCodeVerifier();
    const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
    const codeChallengeMethod = 'S256';

    // Save to use on handleCallback method
    localStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('redirect', redirect);

    const authorizationUrl = new URL(as.authorization_endpoint!);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('code_challenge', codeChallenge);
    authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
    authorizationUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth-callback`);
    authorizationUrl.searchParams.set('scope', 'openid webid offline_access');
    authorizationUrl.searchParams.set('is_signup', isSignup);

    // @ts-expect-error TS(2322): Type 'URL' is not assignable to type '(string | Lo... Remove this comment to see the full error message
    window.location = authorizationUrl;
  },
  handleCallback: async () => {
    const { searchParams } = new URL(window.location.href);

    // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const issuer = new URL(searchParams.get('iss'));
    const as = await oauth.discoveryRequest(issuer).then(response => oauth.processDiscoveryResponse(issuer, response));

    const client = {
      client_id: clientId,
      token_endpoint_auth_method: 'none' // We don't have a client secret
    } as oauth.Client;

    const currentUrl = new URL(window.location.href);
    const params = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState);
    if (oauth.isOAuth2Error(params)) {
      throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
    }

    // Retrieve data set during login
    const codeVerifier = localStorage.getItem('code_verifier')!;
    const redirect = localStorage.getItem('redirect');

    const response = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      params,
      `${window.location.origin}/auth-callback`,
      codeVerifier
    );

    const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response);
    if (oauth.isOAuth2Error(result)) {
      // @ts-expect-error
      throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
    }

    // Until DPoP is implemented, use the ID token to log into local Pod
    // And the proxy endpoint to log into remote Pods
    localStorage.setItem('token', result.id_token);

    // Remove we don't need it anymore
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('redirect');

    // Reload to ensure the dataServer config is reset
    window.location.href = redirect || '/';
  },
  signup: async (params: any) => {
    // Not implemented ?
  },
  logout: async (params: any) => {
    const { redirectUrl } = params || {};

    const token = localStorage.getItem('token');
    if (token) {
      const { webid: webId }: any = jwtDecode(token); // Not webId !!

      // Delete token but also any other value in local storage
      localStorage.clear();

      if (redirectUrl) {
        return redirectUrl;
      } else {
        // We don't need the token to fetch the WebID since it is public
        const { json: userData } = await dataProvider.fetch(webId);

        // Redirect to the Pod provider
        return userData?.['solid:oidcIssuer'] || new URL(webId).origin;
      }
    } else {
      return redirectUrl;
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token && !allowAnonymous) throw new Error();
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
  getIdentity: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = jwtDecode(token);

      const webId = payload.webid; // Not webId !!

      if (!webId) {
        // If webId is not set, it is probably because we have ActivityPods v1 tokens and we need to disconnect
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('No webId found on provided token !');
      }

      const { json: webIdData } = await dataProvider.fetch(webId);
      let profileData = {};

      if (webIdData.url) {
        try {
          const { status, json } = await dataProvider.fetch(webIdData.url);
          if (status === 200) profileData = json;
        } catch (e) {
          // Could not fetch profile. Continue...
          console.error(e);
        }
      }

      return {
        id: webId,
        fullName:
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          profileData['vcard:given-name'] ||
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          profileData['pair:label'] ||
          webIdData['foaf:name'] ||
          webIdData['pair:label'],
        avatar:
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          profileData['vcard:photo'] ||
          webIdData.image?.url ||
          webIdData.image ||
          webIdData.icon?.url ||
          webIdData.icon,
        profileData,
        webIdData
      } as UserIdentity;
    }
  }
});

export default solidAuthProvider;
