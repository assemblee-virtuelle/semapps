import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import * as oauth from 'oauth4webapi';
import { defaultToArray, getAclUri, getAclContext, getAuthServerUrl } from './utils';

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
  const callCheckUser = async webId => {
    if (checkUser) {
      try {
        const { json: userData } = await dataProvider.fetch(webId);
        if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
        if (checkUser(userData) === false) throw new Error('auth.message.user_not_allowed_to_login');
      } catch (e) {
        localStorage.removeItem('token');
        throw e;
      }
    }
  };
  return {
    login: async params => {
      if (authType === AUTH_TYPE_SOLID_OIDC) {
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
        const { username, password } = params;
        const authServerUrl = await getAuthServerUrl(dataProvider);
        let token, webId;

        try {
          ({
            json: { token, webId }
          } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/login'), {
            method: 'POST',
            body: JSON.stringify({
              username: username.trim(),
              password: password.trim()
            }),
            headers: new Headers({ 'Content-Type': 'application/json' })
          }));
        } catch (e) {
          throw new Error('ra.auth.sign_in_error');
        }

        // Set token now as it is required for refreshConfig
        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();

        await callCheckUser(webId);
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

        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();

        await callCheckUser(webId);
      }
    },
    signup: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      if (authType === AUTH_TYPE_LOCAL) {
        const { username, email, password, domain, ...profileData } = params;
        let token, webId;

        try {
          ({
            json: { token, webId }
          } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/signup'), {
            method: 'POST',
            body: JSON.stringify({
              username: username?.trim(),
              email: email.trim(),
              password: password.trim(),
              ...profileData
            }),
            headers: new Headers({ 'Content-Type': 'application/json' })
          }));
        } catch (e) {
          if (e.message === 'email.already.exists') {
            throw new Error('auth.message.user_email_exist');
          } else if (e.message === 'username.already.exists') {
            throw new Error('auth.message.username_exist');
          } else if (e.message === 'username.invalid') {
            throw new Error('auth.message.username_invalid');
          } else {
            throw new Error('auth.message.signup_error');
          }
        }

        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();

        await callCheckUser(webId);

        return webId;
      } else {
        const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
        window.location.href = urlJoin(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    },
    logout: async params => {
      const { redirectUrl } = params || {};
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
    checkError: error => {
      // We want to disconnect only with INVALID_TOKEN errors
      if (error.status === 401 && error.body && error.body.type === 'INVALID_TOKEN') {
        localStorage.removeItem('token');
        return Promise.reject();
      } else {
        // Other error code (404, 500, etc): no need to log out
        return Promise.resolve();
      }
    },
    getPermissions: async ({ uri }) => {
      if (!checkPermissions) return;
      if (!uri) return;

      if (!uri.startsWith('http')) throw new Error('The first parameter passed to getPermissions must be an URL:');

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

        // Backend-generated tokens use webId but Solid-OIDC tokens use webid
        const webId = authType === AUTH_TYPE_SOLID_OIDC ? payload.webid : payload.webId;

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
            profileData['vcard:given-name'] ||
            profileData['pair:label'] ||
            webIdData['foaf:name'] ||
            webIdData['pair:label'],
          avatar:
            profileData['vcard:photo'] ||
            webIdData.image?.url ||
            webIdData.image ||
            webIdData.icon?.url ||
            webIdData.icon,
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
        if (e.message === 'email.not.exists') {
          throw new Error('auth.message.user_email_not_found');
        } else {
          throw new Error('auth.notification.reset_password_error');
        }
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
        if (e.message === 'email.not.exists') {
          throw new Error('auth.message.user_email_not_found');
        } else {
          throw new Error('auth.notification.new_password_error');
        }
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
    }
  };
};

export default authProvider;
