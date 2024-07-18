import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import * as oauth from 'oauth4webapi';
import { defaultToArray, getAclUri, getAclContext, getAuthServerUrl, delay } from './utils';

const AUTH_TYPE_SSO = 'sso';
const AUTH_TYPE_LOCAL = 'local';
const AUTH_TYPE_POD = 'pod';
const AUTH_TYPE_SOLID_OIDC = 'solid-oidc';

const authProvider = ({
  dataProvider,
  authType,
  allowAnonymous = true,
  checkUser,
  checkPermissions = false,
  clientId
}) => {
  if (![AUTH_TYPE_SSO, AUTH_TYPE_LOCAL, AUTH_TYPE_POD, AUTH_TYPE_SOLID_OIDC].includes(authType))
    throw new Error('The authType parameter is missing from the auth provider');
  if (authType === AUTH_TYPE_SOLID_OIDC && !clientId)
    throw new Error('The clientId parameter is required for solid-oidc authentication');
  return {
    login: async params => {
      if (authType === AUTH_TYPE_SOLID_OIDC) {
        const { webId, issuer, redirect = '/', isSignup = false } = params;

        if (webId && !issuer) {
          // TODO find issuer from webId
        }

        const as = await oauth
          .discoveryRequest(new URL(issuer))
          .then(response => oauth.processDiscoveryResponse(new URL(issuer), response));

        const codeVerifier = oauth.generateRandomCodeVerifier();
        const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
        const codeChallengeMethod = 'S256';

        // Save to use on handleCallback method
        localStorage.setItem('code_verifier', codeVerifier);
        localStorage.setItem('redirect', redirect);

        const authorizationUrl = new URL(as.authorization_endpoint);
        authorizationUrl.searchParams.set('response_type', 'code');
        authorizationUrl.searchParams.set('client_id', clientId);
        authorizationUrl.searchParams.set('code_challenge', codeChallenge);
        authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
        authorizationUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth-callback`);
        authorizationUrl.searchParams.set('scope', 'openid webid offline_access');
        authorizationUrl.searchParams.set('is_signup', isSignup);

        window.location = authorizationUrl;
      } else if (authType === AUTH_TYPE_LOCAL) {
        const { username, password, interactionId, redirectTo } = params;
        const authServerUrl = await getAuthServerUrl(dataProvider);
        try {
          const { json } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/login'), {
            method: 'POST',
            body: JSON.stringify({
              username: username.trim(),
              password: password.trim(),
              interactionId
            }),
            headers: new Headers({ 'Content-Type': 'application/json' })
          });
          const { token } = json;
          localStorage.setItem('token', token);
          if (redirectTo) {
            if (interactionId) await delay(3000); // Ensure the interactionId has been received and processed
            window.location.href = redirectTo;
          } else {
            // Reload to ensure the dataServer config is reset
            window.location.reload();
          }
        } catch (e) {
          throw new Error('ra.auth.sign_in_error');
        }
      } else if (authType === AUTH_TYPE_SSO) {
        const authServerUrl = await getAuthServerUrl(dataProvider);
        let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
        if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
        window.location.href = urlJoin(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    },
    handleCallback: async () => {
      const { searchParams } = new URL(window.location);

      if (authType === AUTH_TYPE_SOLID_OIDC) {
        const issuer = new URL(searchParams.get('iss'));
        const as = await oauth
          .discoveryRequest(issuer)
          .then(response => oauth.processDiscoveryResponse(issuer, response));

        const client = {
          client_id: clientId,
          token_endpoint_auth_method: 'none' // We don't have a client secret
        };

        const currentUrl = new URL(window.location.href);
        const params = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState);
        if (oauth.isOAuth2Error(params)) {
          throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
        }

        // Retrieve data set during login
        const codeVerifier = localStorage.getItem('code_verifier');
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
      } else {
        const token = searchParams.get('token');
        if (!token) throw new Error('auth.message.no_token_returned');

        let webId;
        try {
          ({ webId } = jwtDecode(token));
        } catch (e) {
          throw new Error('auth.message.invalid_token_returned');
        }
        const { json } = await dataProvider.fetch(webId);

        if (!json) throw new Error('auth.message.unable_to_fetch_user_data');

        if (checkUser && !checkUser(json)) throw new Error('auth.message.user_not_allowed_to_login');

        localStorage.setItem('token', token);

        // Reload to ensure the dataServer config is reset
        window.location.href = '/';
      }
    },
    signup: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      if (authType === AUTH_TYPE_LOCAL) {
        const { username, email, password, domain, interactionId, ...profileData } = params;
        try {
          const { json } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/signup'), {
            method: 'POST',
            body: JSON.stringify({
              username: username?.trim(),
              email: email.trim(),
              password: password.trim(),
              interactionId,
              ...profileData
            }),
            headers: new Headers({ 'Content-Type': 'application/json' })
          });
          const { token } = json;
          localStorage.setItem('token', token);
          const { webId } = jwtDecode(token);
          return webId;
        } catch (e) {
          if (e.message === 'email.already.exists') {
            throw new Error('auth.message.user_email_exist');
          } else if (e.message === 'username.already.exists') {
            throw new Error('auth.message.username_exist');
          } else if (e.message === 'username.invalid') {
            throw new Error('auth.message.username_invalid');
          } else {
            throw new Error(e.message || 'ra.auth.sign_in_error');
          }
        }
      } else {
        const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
        window.location.href = urlJoin(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    },
    logout: async () => {
      switch (authType) {
        case AUTH_TYPE_LOCAL: {
          const authServerUrl = await getAuthServerUrl(dataProvider);

          // Delete token but also any other value in local storage
          localStorage.clear();

          let result = {};

          try {
            result = await dataProvider.fetch(urlJoin(authServerUrl, '.well-known/openid-configuration'));
          } catch (e) {
            // Do nothing if it fails
          }

          if (result.status === 200 && result.json) {
            // Redirect to OIDC endpoint if it exists
            window.location.href = result.json.end_session_endpoint;
          } else {
            // Reload to ensure the dataServer config is reset
            window.location.reload();
            window.location.href = '/';
          }

          break;
        }

        case AUTH_TYPE_SSO: {
          const authServerUrl = await getAuthServerUrl(dataProvider);
          const baseUrl = new URL(window.location.href).origin;
          return urlJoin(
            authServerUrl,
            `auth/logout?redirectUrl=${encodeURIComponent(`${urlJoin(baseUrl, 'login')}?logout=true`)}`
          );
        }

        case AUTH_TYPE_POD: {
          const token = localStorage.getItem('token');
          if (token) {
            const { webId } = jwtDecode(token);
            // Delete token but also any other value in local storage
            localStorage.clear();
            // Redirect to the POD provider
            return `${urlJoin(webId, 'openApp')}?type=${encodeURIComponent(
              'http://activitypods.org/ns/core#FrontAppRegistration'
            )}`;
          }
          break;
        }

        case AUTH_TYPE_SOLID_OIDC: {
          const token = localStorage.getItem('token');
          if (token) {
            const { webid: webId } = jwtDecode(token); // Not webId !!

            // Delete token but also any other value in local storage
            localStorage.clear();

            // Redirect to the POD provider
            return `${urlJoin(webId, 'openApp')}?type=${encodeURIComponent(
              'http://www.w3.org/ns/solid/interop#ApplicationRegistration'
            )}`;
          }
          break;
        }

        default:
          break;
      }
    },
    checkAuth: async () => {
      const token = localStorage.getItem('token');
      if (!token && !allowAnonymous) throw new Error();
    },
    checkUser: userData => {
      if (checkUser) {
        return checkUser(userData);
      }
      return true;
    },
    checkError: error => Promise.resolve(),
    getPermissions: async uri => {
      if (!checkPermissions) return;

      // React-admin calls getPermissions with an empty object on every page refresh
      // It also passes an object `{ params: { route: 'dashboard' } }` on the Dashboard
      // Ignore all this until we found a way to bypass these redundant calls
      if (typeof uri === 'object') return;

      if (!uri || !uri.startsWith('http'))
        throw new Error('The first parameter passed to getPermissions must be an URL');

      const aclUri = getAclUri(uri);

      try {
        const { json } = await dataProvider.fetch(aclUri);
        return json['@graph'];
      } catch (e) {
        console.warn(`Could not fetch ACL URI ${uri}`);
        return [];
      }
    },
    addPermission: async (uri, agentId, predicate, mode) => {
      if (!uri || !uri.startsWith('http'))
        throw new Error('The first parameter passed to addPermission must be an URL');

      const aclUri = getAclUri(uri);

      const authorization = {
        '@id': `#${mode.replace('acl:', '')}`,
        '@type': 'acl:Authorization',
        [predicate]: agentId,
        'acl:accessTo': uri,
        'acl:mode': mode
      };

      await dataProvider.fetch(aclUri, {
        method: 'PATCH',
        body: JSON.stringify({
          '@context': getAclContext(aclUri),
          '@graph': [authorization]
        })
      });
    },
    removePermission: async (uri, agentId, predicate, mode) => {
      if (!uri || !uri.startsWith('http'))
        throw new Error('The first parameter passed to removePermission must be an URL');

      const aclUri = getAclUri(uri);

      // Fetch current permissions
      const { json } = await dataProvider.fetch(aclUri);

      const updatedPermissions = json['@graph']
        .filter(authorization => !authorization['@id'].includes('#Default'))
        .map(authorization => {
          const modes = defaultToArray(authorization['acl:mode']);
          let agents = defaultToArray(authorization[predicate]);
          if (mode && modes.includes(mode) && agents && agents.includes(agentId)) {
            agents = agents.filter(agent => agent !== agentId);
          }
          return { ...authorization, [predicate]: agents };
        });

      await dataProvider.fetch(aclUri, {
        method: 'PUT',
        body: JSON.stringify({
          '@context': getAclContext(aclUri),
          '@graph': updatedPermissions
        })
      });
    },
    getIdentity: async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = jwtDecode(token);
        const webId = payload.webId || payload.webid; // Currently we must deal with both formats

        if (!webId) throw new Error('No webId found on provided token !');

        const { json: webIdData } = await dataProvider.fetch(webId);
        const { json: profileData } = webIdData.url ? await dataProvider.fetch(webIdData.url) : {};

        return {
          id: webId,
          fullName:
            profileData?.['vcard:given-name'] ||
            profileData?.['pair:label'] ||
            webIdData['foaf:name'] ||
            webIdData['pair:label'],
          profileData,
          webIdData
        };
      }
    },
    resetPassword: async params => {
      const { email } = params;
      const authServerUrl = await getAuthServerUrl(dataProvider);
      try {
        await dataProvider.fetch(urlJoin(authServerUrl, 'auth/reset_password'), {
          method: 'POST',
          body: JSON.stringify({ email: email.trim() }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        });
      } catch (e) {
        throw new Error('auth.notification.reset_password_error');
      }
    },
    setNewPassword: async params => {
      const { email, token, password } = params;
      const authServerUrl = await getAuthServerUrl(dataProvider);
      try {
        await dataProvider.fetch(urlJoin(authServerUrl, 'auth/new_password'), {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), token, password }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        });
      } catch (e) {
        throw new Error('auth.notification.new_password_error');
      }
    },
    getAccountSettings: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      try {
        const { json } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/account'));
        return json;
      } catch (e) {
        throw new Error('auth.notification.get_settings_error');
      }
    },
    updateAccountSettings: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      try {
        const { email, currentPassword, newPassword } = params;

        await dataProvider.fetch(urlJoin(authServerUrl, 'auth/account'), {
          method: 'POST',
          body: JSON.stringify({
            currentPassword,
            email: email?.trim(),
            newPassword
          }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        });
      } catch (e) {
        if (e.message === 'auth.account.invalid_password') {
          throw new Error('auth.notification.invalid_password');
        }

        throw new Error('auth.notification.update_settings_error');
      }
    },
    /**
     * Inform the OIDC server that the login interaction has been completed.
     * This is necessary, otherwise the OIDC server will keep on redirecting to the login form.
     * We call the endpoint with the token as a proof of login, otherwise it could be abused.
     */
    loginCompleted: async (interactionId, webId) => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      // Note: the
      await dataProvider.fetch(urlJoin(authServerUrl, '.oidc/login-completed'), {
        method: 'POST',
        body: JSON.stringify({
          interactionId,
          webId
        }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      });
    }
  };
};

export default authProvider;
