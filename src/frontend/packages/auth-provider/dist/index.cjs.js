var $4Uj5b$jwtdecode = require('jwt-decode');
var $4Uj5b$urljoin = require('url-join');
var $4Uj5b$oauth4webapi = require('oauth4webapi');
var $4Uj5b$reactjsxruntime = require('react/jsx-runtime');
var $4Uj5b$react = require('react');
var $4Uj5b$reactadmin = require('react-admin');
var $4Uj5b$semappssemanticdataprovider = require('@semapps/semantic-data-provider');
var $4Uj5b$muiiconsmaterialShare = require('@mui/icons-material/Share');
var $4Uj5b$muimaterial = require('@mui/material');
var $4Uj5b$muistylesmakeStyles = require('@mui/styles/makeStyles');
var $4Uj5b$muimaterialAutocomplete = require('@mui/material/Autocomplete');
var $4Uj5b$muiiconsmaterialPerson = require('@mui/icons-material/Person');
var $4Uj5b$muisystem = require('@mui/system');
var $4Uj5b$muiiconsmaterialEdit = require('@mui/icons-material/Edit');
var $4Uj5b$muiiconsmaterialCheck = require('@mui/icons-material/Check');
var $4Uj5b$muiiconsmaterialPublic = require('@mui/icons-material/Public');
var $4Uj5b$muiiconsmaterialVpnLock = require('@mui/icons-material/VpnLock');
var $4Uj5b$muiiconsmaterialGroup = require('@mui/icons-material/Group');
var $4Uj5b$muimaterialstyles = require('@mui/material/styles');
var $4Uj5b$reactrouterdom = require('react-router-dom');
var $4Uj5b$muiiconsmaterialLock = require('@mui/icons-material/Lock');
var $4Uj5b$speakingurl = require('speakingurl');
var $4Uj5b$muistyles = require('@mui/styles');
var $4Uj5b$muiiconsmaterialAccountCircle = require('@mui/icons-material/AccountCircle');
var $4Uj5b$lodashisEqual = require('lodash/isEqual');

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, 'authProvider', () => $6a92eb32301846ac$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'CreateWithPermissions', () => $7c87aa71409e289a$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'EditWithPermissions', () => $6f1389d03e4735d1$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'EditActionsWithPermissions', () => $87767302443de17c$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'EditToolbarWithPermissions', () => $41feb0ed0192b62e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'EditButtonWithPermissions', () => $496e40eed9f00a2c$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'DeleteButtonWithPermissions', () => $79bac4913d414938$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ListWithPermissions', () => $15811bcd3a3eb59f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ListActionsWithPermissions', () => $6452f20f9b47ebd6$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ShowWithPermissions', () => $773eb052716d0fa7$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ShowActionsWithPermissions', () => $43f4d313e20b20c2$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'PermissionsButton', () => $49d4f2fbe6f28cfd$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'AuthDialog', () => $4e0bf9be00aaa242$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'SsoLoginPage', () => $0af8eee27f6a6e9f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'LoginPage', () => $0af8eee27f6a6e9f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'LocalLoginPage', () => $4c56dbfbda0fa20c$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'ResourceWithPermissions', () => $0973974d3aa8078b$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'UserMenu', () => $9734e84907c0d5dd$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useAgents', () => $780e01b2b2982de2$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useCheckAuthenticated', () => $84db3891236a263f$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useCheckPermissions', () => $715d0a876ac5de8e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'usePermissionsWithRefetch', () => $80da6dcda9baa28b$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'useSignup', () => $19e4629c708b7a3e$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'PasswordStrengthIndicator', () => $edfec7f9e9fd7881$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'validatePasswordStrength', () => $eab41bc89667b2c6$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'defaultPasswordScorer', () => $d1ca1e1d215e32ca$export$19dcdb21c6965fb8);
$parcel$export(module.exports, 'defaultPasswordScorerOptions', () => $d1ca1e1d215e32ca$export$ba43bf67f3d48107);
$parcel$export(module.exports, 'createPasswordScorer', () => $d1ca1e1d215e32ca$export$a1d713a9155d58fc);
$parcel$export(module.exports, 'englishMessages', () => $be2fdde9f3e3137d$export$2e2bcd8739ae039);
$parcel$export(module.exports, 'frenchMessages', () => $6dbc362c3d93e01d$export$2e2bcd8739ae039);

const $2d06940433ec0c6c$export$dca4f48302963835 = value =>
  !value ? undefined : Array.isArray(value) ? value : [value];
const $2d06940433ec0c6c$export$4450a74bced1b745 = resourceUri => {
  const parsedUrl = new URL(resourceUri);
  return (0, $parcel$interopDefault($4Uj5b$urljoin))(parsedUrl.origin, '_acl', parsedUrl.pathname);
};
const $2d06940433ec0c6c$export$4d54b642c3d13c34 = baseUri => ({
  '@base': baseUri,
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  'acl:agent': {
    '@type': '@id'
  },
  'acl:agentGroup': {
    '@type': '@id'
  },
  'acl:agentClass': {
    '@type': '@id'
  },
  'acl:mode': {
    '@type': '@id'
  },
  'acl:accessTo': {
    '@type': '@id'
  }
});
const $2d06940433ec0c6c$export$274217e117cdbc7b = async dataProvider => {
  const dataServers = await dataProvider.getDataServers();
  const authServer = Object.values(dataServers).find(server => server.authServer === true);
  if (!authServer) throw new Error('Could not find a server with authServer: true. Check your dataServers config.');
  // If the server is a POD, return the root URL instead of https://domain.com/user/data
  // TODO Use 'solid:oidcIssuer' when it is available
  return authServer.pod ? new URL(authServer.baseUrl).origin : authServer.baseUrl;
};
const $2d06940433ec0c6c$export$1391212d75b2ee65 = async t => new Promise(resolve => setTimeout(resolve, t));

const $6a92eb32301846ac$var$AUTH_TYPE_SSO = 'sso';
const $6a92eb32301846ac$var$AUTH_TYPE_LOCAL = 'local';
const $6a92eb32301846ac$var$AUTH_TYPE_POD = 'pod';
const $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC = 'solid-oidc';
const $6a92eb32301846ac$var$authProvider = ({
  dataProvider: dataProvider,
  authType: authType,
  allowAnonymous: allowAnonymous = true,
  checkUser: checkUser,
  checkPermissions: checkPermissions = false,
  clientId: clientId
}) => {
  if (
    ![
      $6a92eb32301846ac$var$AUTH_TYPE_SSO,
      $6a92eb32301846ac$var$AUTH_TYPE_LOCAL,
      $6a92eb32301846ac$var$AUTH_TYPE_POD,
      $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC
    ].includes(authType)
  )
    throw new Error('The authType parameter is missing from the auth provider');
  if (authType === $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC && !clientId)
    throw new Error('The clientId parameter is required for solid-oidc authentication');
  const callCheckUser = async webId => {
    if (checkUser)
      try {
        const { json: userData } = await dataProvider.fetch(webId);
        if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
        if (checkUser(userData) === false) throw new Error('auth.message.user_not_allowed_to_login');
      } catch (e) {
        localStorage.removeItem('token');
        throw e;
      }
  };
  return {
    login: async params => {
      if (authType === $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC) {
        const { webId: webId, issuer: issuer, redirect: redirect = '/', isSignup: isSignup = false } = params;
        webId && issuer;
        const as = await $4Uj5b$oauth4webapi
          .discoveryRequest(new URL(issuer))
          .then(response => $4Uj5b$oauth4webapi.processDiscoveryResponse(new URL(issuer), response));
        const codeVerifier = $4Uj5b$oauth4webapi.generateRandomCodeVerifier();
        const codeChallenge = await $4Uj5b$oauth4webapi.calculatePKCECodeChallenge(codeVerifier);
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
      } else if (authType === $6a92eb32301846ac$var$AUTH_TYPE_LOCAL) {
        const { username: username, password: password } = params;
        const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
        let token, webId;
        try {
          ({
            json: { token: token, webId: webId }
          } = await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/login'), {
            method: 'POST',
            body: JSON.stringify({
              username: username.trim(),
              password: password.trim()
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }));
        } catch (e) {
          throw new Error('ra.auth.sign_in_error');
        }
        // Set token now as it is required for refreshConfig
        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();
        await callCheckUser(webId);
      } else if (authType === $6a92eb32301846ac$var$AUTH_TYPE_SSO) {
        const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
        let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
        if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
        window.location.href = (0, $parcel$interopDefault($4Uj5b$urljoin))(
          authServerUrl,
          `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`
        );
      }
    },
    handleCallback: async () => {
      const { searchParams: searchParams } = new URL(window.location);
      if (authType === $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC) {
        const issuer = new URL(searchParams.get('iss'));
        const as = await $4Uj5b$oauth4webapi
          .discoveryRequest(issuer)
          .then(response => $4Uj5b$oauth4webapi.processDiscoveryResponse(issuer, response));
        const client = {
          client_id: clientId,
          token_endpoint_auth_method: 'none' // We don't have a client secret
        };
        const currentUrl = new URL(window.location.href);
        const params = $4Uj5b$oauth4webapi.validateAuthResponse(
          as,
          client,
          currentUrl,
          $4Uj5b$oauth4webapi.expectNoState
        );
        if ($4Uj5b$oauth4webapi.isOAuth2Error(params))
          throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
        // Retrieve data set during login
        const codeVerifier = localStorage.getItem('code_verifier');
        const redirect = localStorage.getItem('redirect');
        const response = await $4Uj5b$oauth4webapi.authorizationCodeGrantRequest(
          as,
          client,
          params,
          `${window.location.origin}/auth-callback`,
          codeVerifier
        );
        const result = await $4Uj5b$oauth4webapi.processAuthorizationCodeOpenIDResponse(as, client, response);
        if ($4Uj5b$oauth4webapi.isOAuth2Error(result))
          throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
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
          ({ webId: webId } = (0, $parcel$interopDefault($4Uj5b$jwtdecode))(token));
        } catch (e) {
          throw new Error('auth.message.invalid_token_returned');
        }
        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();
        await callCheckUser(webId);
      }
    },
    signup: async params => {
      const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
      if (authType === $6a92eb32301846ac$var$AUTH_TYPE_LOCAL) {
        const { username: username, email: email, password: password, domain: domain, ...profileData } = params;
        let token, webId;
        try {
          ({
            json: { token: token, webId: webId }
          } = await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/signup'), {
            method: 'POST',
            body: JSON.stringify({
              username: username?.trim(),
              email: email.trim(),
              password: password.trim(),
              ...profileData
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }));
        } catch (e) {
          if (e.message === 'email.already.exists') throw new Error('auth.message.user_email_exist');
          else if (e.message === 'username.already.exists') throw new Error('auth.message.username_exist');
          else if (e.message === 'username.invalid') throw new Error('auth.message.username_invalid');
          else throw new Error('auth.message.signup_error');
        }
        localStorage.setItem('token', token);
        await dataProvider.refreshConfig();
        await callCheckUser(webId);
        return webId;
      } else {
        const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
        window.location.href = (0, $parcel$interopDefault($4Uj5b$urljoin))(
          authServerUrl,
          `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`
        );
      }
    },
    logout: async params => {
      const { redirectUrl: redirectUrl } = params || {};
      switch (authType) {
        case $6a92eb32301846ac$var$AUTH_TYPE_LOCAL: {
          const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
          // Delete token but also any other value in local storage
          localStorage.clear();
          let result = {};
          try {
            result = await dataProvider.fetch(
              (0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, '.well-known/openid-configuration')
            );
          } catch (e) {
            // Do nothing if it fails
          }
          if (result.status === 200 && result.json)
            // Redirect to OIDC endpoint if it exists
            window.location.href = result.json.end_session_endpoint;
          else {
            // Reload to ensure the dataServer config is reset
            window.location.reload();
            window.location.href = '/';
          }
          break;
        }
        case $6a92eb32301846ac$var$AUTH_TYPE_SSO: {
          const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
          const baseUrl = new URL(window.location.href).origin;
          return (0, $parcel$interopDefault($4Uj5b$urljoin))(
            authServerUrl,
            `auth/logout?redirectUrl=${encodeURIComponent(
              `${(0, $parcel$interopDefault($4Uj5b$urljoin))(baseUrl, 'login')}?logout=true`
            )}`
          );
        }
        case $6a92eb32301846ac$var$AUTH_TYPE_POD: {
          const token = localStorage.getItem('token');
          if (token) {
            const { webId: webId } = (0, $parcel$interopDefault($4Uj5b$jwtdecode))(token);
            // Delete token but also any other value in local storage
            localStorage.clear();
            // Redirect to the POD provider
            return `${(0, $parcel$interopDefault($4Uj5b$urljoin))(webId, 'openApp')}?type=${encodeURIComponent(
              'http://activitypods.org/ns/core#FrontAppRegistration'
            )}`;
          }
          break;
        }
        case $6a92eb32301846ac$var$AUTH_TYPE_SOLID_OIDC: {
          const token = localStorage.getItem('token');
          if (token) {
            const { webid: webId } = (0, $parcel$interopDefault($4Uj5b$jwtdecode))(token); // Not webId !!
            // Delete token but also any other value in local storage
            localStorage.clear();
            // Redirect to the Pod provider
            // TODO Use 'solid:oidcIssuer' when it is available
            // See https://github.com/activitypods/activitypods/issues/122
            return redirectUrl || new URL(webId).origin;
          } else return redirectUrl;
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
      if (checkUser) return checkUser(userData);
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
      const aclUri = (0, $2d06940433ec0c6c$export$4450a74bced1b745)(uri);
      try {
        const { json: json } = await dataProvider.fetch(aclUri);
        return json['@graph'];
      } catch (e) {
        console.warn(`Could not fetch ACL URI ${uri}`);
        return [];
      }
    },
    addPermission: async (uri, agentId, predicate, mode) => {
      if (!uri || !uri.startsWith('http'))
        throw new Error('The first parameter passed to addPermission must be an URL');
      const aclUri = (0, $2d06940433ec0c6c$export$4450a74bced1b745)(uri);
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
          '@context': (0, $2d06940433ec0c6c$export$4d54b642c3d13c34)(aclUri),
          '@graph': [authorization]
        })
      });
    },
    removePermission: async (uri, agentId, predicate, mode) => {
      if (!uri || !uri.startsWith('http'))
        throw new Error('The first parameter passed to removePermission must be an URL');
      const aclUri = (0, $2d06940433ec0c6c$export$4450a74bced1b745)(uri);
      // Fetch current permissions
      const { json: json } = await dataProvider.fetch(aclUri);
      const updatedPermissions = json['@graph']
        .filter(authorization => !authorization['@id'].includes('#Default'))
        .map(authorization => {
          const modes = (0, $2d06940433ec0c6c$export$dca4f48302963835)(authorization['acl:mode']);
          let agents = (0, $2d06940433ec0c6c$export$dca4f48302963835)(authorization[predicate]);
          if (mode && modes.includes(mode) && agents && agents.includes(agentId))
            agents = agents.filter(agent => agent !== agentId);
          return {
            ...authorization,
            [predicate]: agents
          };
        });
      await dataProvider.fetch(aclUri, {
        method: 'PUT',
        body: JSON.stringify({
          '@context': (0, $2d06940433ec0c6c$export$4d54b642c3d13c34)(aclUri),
          '@graph': updatedPermissions
        })
      });
    },
    getIdentity: async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = (0, $parcel$interopDefault($4Uj5b$jwtdecode))(token);
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
          profileData: profileData,
          webIdData: webIdData
        };
      }
    },
    resetPassword: async params => {
      const { email: email } = params;
      const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
      try {
        await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/reset_password'), {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim()
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        });
      } catch (e) {
        if (e.message === 'email.not.exists') throw new Error('auth.message.user_email_not_found');
        else throw new Error('auth.notification.reset_password_error');
      }
    },
    setNewPassword: async params => {
      const { email: email, token: token, password: password } = params;
      const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
      try {
        await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/new_password'), {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim(),
            token: token,
            password: password
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        });
      } catch (e) {
        if (e.message === 'email.not.exists') throw new Error('auth.message.user_email_not_found');
        else throw new Error('auth.notification.new_password_error');
      }
    },
    getAccountSettings: async params => {
      const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
      try {
        const { json: json } = await dataProvider.fetch(
          (0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/account')
        );
        return json;
      } catch (e) {
        throw new Error('auth.notification.get_settings_error');
      }
    },
    updateAccountSettings: async params => {
      const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
      try {
        const { email: email, currentPassword: currentPassword, newPassword: newPassword } = params;
        await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, 'auth/account'), {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: currentPassword,
            email: email?.trim(),
            newPassword: newPassword
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        });
      } catch (e) {
        if (e.message === 'auth.account.invalid_password') throw new Error('auth.notification.invalid_password');
        throw new Error('auth.notification.update_settings_error');
      }
    }
  };
};
var $6a92eb32301846ac$export$2e2bcd8739ae039 = $6a92eb32301846ac$var$authProvider;

const $09c536abc6cea017$export$66a34090010a35b3 = 'acl:Read';
const $09c536abc6cea017$export$7c883503ccedfe0e = 'acl:Append';
const $09c536abc6cea017$export$2e56ecf100ca4ba6 = 'acl:Write';
const $09c536abc6cea017$export$5581cb2c55de143a = 'acl:Control';
const $09c536abc6cea017$export$97a08a1bb7ee0545 = 'acl:agent';
const $09c536abc6cea017$export$f07ccbe0773f2c7 = 'acl:agentGroup';
const $09c536abc6cea017$export$2703254089a859eb = 'acl:agentClass';
const $09c536abc6cea017$export$83ae1bc0992a6335 = 'foaf:Agent';
const $09c536abc6cea017$export$546c01a3ffdabe3a = 'acl:AuthenticatedAgent';
const $09c536abc6cea017$export$d37f0098bcf84c55 = [
  $09c536abc6cea017$export$66a34090010a35b3,
  $09c536abc6cea017$export$7c883503ccedfe0e,
  $09c536abc6cea017$export$2e56ecf100ca4ba6,
  $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$dc3840a4e2a72b8c = [
  $09c536abc6cea017$export$66a34090010a35b3,
  $09c536abc6cea017$export$7c883503ccedfe0e,
  $09c536abc6cea017$export$2e56ecf100ca4ba6,
  $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$65615a101bd6f5ca = [
  $09c536abc6cea017$export$7c883503ccedfe0e,
  $09c536abc6cea017$export$2e56ecf100ca4ba6,
  $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$b9d0f5f3ab5e453b = [
  $09c536abc6cea017$export$7c883503ccedfe0e,
  $09c536abc6cea017$export$2e56ecf100ca4ba6,
  $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$ac7b0367c0f9031e = [
  $09c536abc6cea017$export$2e56ecf100ca4ba6,
  $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$22242524f7d0624 = [$09c536abc6cea017$export$5581cb2c55de143a];
const $09c536abc6cea017$export$cae945d60b6cbe50 = {
  show: $09c536abc6cea017$export$d37f0098bcf84c55,
  list: $09c536abc6cea017$export$dc3840a4e2a72b8c,
  create: $09c536abc6cea017$export$65615a101bd6f5ca,
  edit: $09c536abc6cea017$export$b9d0f5f3ab5e453b,
  delete: $09c536abc6cea017$export$ac7b0367c0f9031e,
  control: $09c536abc6cea017$export$22242524f7d0624
};
const $09c536abc6cea017$export$12e6e8e71d10a4bb = {
  show: 'auth.message.resource_show_forbidden',
  edit: 'auth.message.resource_edit_forbidden',
  delete: 'auth.message.resource_delete_forbidden',
  control: 'auth.message.resource_control_forbidden',
  list: 'auth.message.container_list_forbidden',
  create: 'auth.message.container_create_forbidden'
};
const $09c536abc6cea017$export$2e9571c4ccdeb6a9 = {
  [$09c536abc6cea017$export$66a34090010a35b3]: 'auth.right.resource.read',
  [$09c536abc6cea017$export$7c883503ccedfe0e]: 'auth.right.resource.append',
  [$09c536abc6cea017$export$2e56ecf100ca4ba6]: 'auth.right.resource.write',
  [$09c536abc6cea017$export$5581cb2c55de143a]: 'auth.right.resource.control'
};
const $09c536abc6cea017$export$edca379024d80309 = {
  [$09c536abc6cea017$export$66a34090010a35b3]: 'auth.right.container.read',
  [$09c536abc6cea017$export$2e56ecf100ca4ba6]: 'auth.right.container.write',
  [$09c536abc6cea017$export$5581cb2c55de143a]: 'auth.right.container.control'
};

const $715d0a876ac5de8e$var$useCheckPermissions = (uri, mode, redirectUrl = '/') => {
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(uri);
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const redirect = (0, $4Uj5b$reactadmin.useRedirect)();
  (0, $4Uj5b$react.useEffect)(() => {
    if (
      permissions &&
      !permissions.some(p => (0, $09c536abc6cea017$export$cae945d60b6cbe50)[mode].includes(p['acl:mode']))
    ) {
      notify((0, $09c536abc6cea017$export$12e6e8e71d10a4bb)[mode], {
        type: 'error'
      });
      redirect(redirectUrl);
    }
  }, [permissions, redirect, notify]);
  return permissions;
};
var $715d0a876ac5de8e$export$2e2bcd8739ae039 = $715d0a876ac5de8e$var$useCheckPermissions;

const $7c87aa71409e289a$var$CreateWithPermissions = props => {
  const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
  const createContainerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)()(resource);
  (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(createContainerUri, 'create');
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Create), {
    ...props
  });
};
$7c87aa71409e289a$var$CreateWithPermissions.defaultProps = {
  actions: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.CreateActions), {})
};
var $7c87aa71409e289a$export$2e2bcd8739ae039 = $7c87aa71409e289a$var$CreateWithPermissions;

const $a613ad42a03b1bc4$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(() => ({
  list: {
    padding: 0,
    width: '100%'
  },
  option: {
    padding: 0
  }
}));
const $a613ad42a03b1bc4$var$AddPermissionsForm = ({ agents: agents, addPermission: addPermission }) => {
  const classes = $a613ad42a03b1bc4$var$useStyles();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const [value, setValue] = (0, $4Uj5b$react.useState)(null);
  const [inputValue, setInputValue] = (0, $4Uj5b$react.useState)('');
  const [options, setOptions] = (0, $4Uj5b$react.useState)([]);
  const { data: data } = (0, $4Uj5b$reactadmin.useGetList)(
    'Person',
    {
      pagination: {
        page: 1,
        perPage: 100
      },
      sort: {
        field: 'pair:label',
        order: 'ASC'
      },
      filter: {
        q: inputValue
      }
    },
    {
      enabled: inputValue.length > 0
    }
  );
  (0, $4Uj5b$react.useEffect)(() => {
    setOptions(data?.length > 0 ? Object.values(data) : []);
  }, [data]);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $parcel$interopDefault($4Uj5b$muimaterialAutocomplete)), {
    classes: {
      option: classes.option
    },
    getOptionLabel: option => option['pair:label'],
    // Do not return agents which have already been added
    filterOptions: x => x.filter(agent => !Object.keys(agents).includes(agent.id)),
    options: options,
    noOptionsText: translate('ra.navigation.no_results'),
    autoComplete: true,
    blurOnSelect: true,
    clearOnBlur: true,
    disableClearable: true,
    value: value,
    onChange: (event, record) => {
      addPermission(
        record.id || record['@id'],
        (0, $09c536abc6cea017$export$97a08a1bb7ee0545),
        (0, $09c536abc6cea017$export$66a34090010a35b3)
      );
      setValue(null);
      setInputValue('');
      setOptions([]);
    },
    onInputChange: (event, newInputValue) => {
      setInputValue(newInputValue);
    },
    renderInput: params =>
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.TextField), {
        ...params,
        label: translate('auth.input.agent_select'),
        variant: 'filled',
        margin: 'dense',
        fullWidth: true
      }),
    renderOption: (props, option) =>
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.List), {
        dense: true,
        className: classes.list,
        ...props,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItem), {
          button: true,
          children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemAvatar), {
              children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
                src: option.image,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
                  (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialPerson)),
                  {}
                )
              })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
              primary: option['pair:label']
            })
          ]
        })
      })
  });
};
var $a613ad42a03b1bc4$export$2e2bcd8739ae039 = $a613ad42a03b1bc4$var$AddPermissionsForm;

const $9f58b72d42a695d9$var$AgentIcon = ({ agent: agent }) => {
  switch (agent.predicate) {
    case (0, $09c536abc6cea017$export$2703254089a859eb):
      return agent.id === (0, $09c536abc6cea017$export$83ae1bc0992a6335)
        ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $parcel$interopDefault($4Uj5b$muiiconsmaterialPublic)), {})
        : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
            (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialVpnLock)),
            {}
          );
    case (0, $09c536abc6cea017$export$97a08a1bb7ee0545):
      return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
        (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialPerson)),
        {}
      );
    case (0, $09c536abc6cea017$export$f07ccbe0773f2c7):
      return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
        (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialGroup)),
        {}
      );
    default:
      throw new Error(`Unknown agent predicate: ${agent.predicate}`);
  }
};
var $9f58b72d42a695d9$export$2e2bcd8739ae039 = $9f58b72d42a695d9$var$AgentIcon;

const $7a8c6187e6c69fdd$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(() => ({
  listItem: {
    paddingLeft: 4,
    paddingRight: 36
  },
  primaryText: {
    width: '30%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  secondaryText: {
    textAlign: 'center',
    width: '60%',
    fontStyle: 'italic',
    color: 'grey'
  }
}));
const $7a8c6187e6c69fdd$var$AgentItem = ({
  isContainer: isContainer,
  agent: agent,
  addPermission: addPermission,
  removePermission: removePermission
}) => {
  const classes = $7a8c6187e6c69fdd$var$useStyles();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
  const [anchorEl, setAnchorEl] = (0, $parcel$interopDefault($4Uj5b$react)).useState(null);
  const [user, setUser] = (0, $4Uj5b$react.useState)();
  const [loading, setLoading] = (0, $4Uj5b$react.useState)(true);
  const [error, setError] = (0, $4Uj5b$react.useState)();
  (0, $4Uj5b$react.useEffect)(() => {
    if (agent.predicate === (0, $09c536abc6cea017$export$97a08a1bb7ee0545))
      dataProvider
        .getOne('Person', {
          id: agent.id
        })
        .then(({ data: data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    else setLoading(false);
  }, [agent.id, agent.predicate]);
  // For now, do not display groups
  if (agent.predicate === (0, $09c536abc6cea017$export$f07ccbe0773f2c7)) return null;
  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const labels = isContainer
    ? (0, $09c536abc6cea017$export$edca379024d80309)
    : (0, $09c536abc6cea017$export$2e9571c4ccdeb6a9);
  if (loading) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Loading), {});
  if (error) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Error), {});
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItem), {
    className: classes.listItem,
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemAvatar), {
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
          src: user?.image,
          children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $9f58b72d42a695d9$export$2e2bcd8739ae039), {
            agent: agent
          })
        })
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
        className: classes.primaryText,
        primary: user
          ? user['pair:label']
          : translate(
              agent.id === (0, $09c536abc6cea017$export$83ae1bc0992a6335)
                ? 'auth.agent.anonymous'
                : 'auth.agent.authenticated'
            )
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
        className: classes.secondaryText,
        primary: agent.permissions && agent.permissions.map(p => translate(labels[p])).join(', ')
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItemSecondaryAction), {
        children: [
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
            onClick: openMenu,
            size: 'large',
            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialEdit)),
              {}
            )
          }),
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Menu), {
            anchorEl: anchorEl,
            keepMounted: true,
            open: Boolean(anchorEl),
            onClose: closeMenu,
            children: Object.entries(labels).map(([rightKey, rightLabel]) => {
              const hasPermission = agent.permissions && agent.permissions.includes(rightKey);
              return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)(
                (0, $4Uj5b$muimaterial.MenuItem),
                {
                  onClick: () => {
                    if (hasPermission) removePermission(agent.id, agent.predicate, rightKey);
                    else addPermission(agent.id, agent.predicate, rightKey);
                    closeMenu();
                  },
                  children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemIcon), {
                      children: hasPermission
                        ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
                            (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialCheck)),
                            {}
                          )
                        : null
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
                      primary: translate(rightLabel)
                    })
                  ]
                },
                rightKey
              );
            })
          })
        ]
      })
    ]
  });
};
var $7a8c6187e6c69fdd$export$2e2bcd8739ae039 = $7a8c6187e6c69fdd$var$AgentItem;

const $6bcadc28bc94109b$var$StyledList = (0, $4Uj5b$muisystem.styled)((0, $4Uj5b$muimaterial.List))(
  ({ theme: theme }) => ({
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper
  })
);
const $6bcadc28bc94109b$var$EditPermissionsForm = ({
  isContainer: isContainer,
  agents: agents,
  addPermission: addPermission,
  removePermission: removePermission
}) => {
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($6bcadc28bc94109b$var$StyledList, {
    dense: true,
    children: Object.entries(agents).map(([agentId, agent]) =>
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
        (0, $7a8c6187e6c69fdd$export$2e2bcd8739ae039),
        {
          isContainer: isContainer,
          agent: agent,
          addPermission: addPermission,
          removePermission: removePermission
        },
        agentId
      )
    )
  });
};
var $6bcadc28bc94109b$export$2e2bcd8739ae039 = $6bcadc28bc94109b$var$EditPermissionsForm;

const $780e01b2b2982de2$var$useAgents = uri => {
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(uri);
  const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
  const [agents, setAgents] = (0, $4Uj5b$react.useState)({});
  // Format list of authorized agents, based on the permissions returned for the resource
  (0, $4Uj5b$react.useEffect)(() => {
    const result = {
      [(0, $09c536abc6cea017$export$83ae1bc0992a6335)]: {
        id: (0, $09c536abc6cea017$export$83ae1bc0992a6335),
        predicate: (0, $09c536abc6cea017$export$2703254089a859eb),
        permissions: []
      },
      [(0, $09c536abc6cea017$export$546c01a3ffdabe3a)]: {
        id: (0, $09c536abc6cea017$export$546c01a3ffdabe3a),
        predicate: (0, $09c536abc6cea017$export$2703254089a859eb),
        permissions: []
      }
    };
    const appendPermission = (agentId, predicate, mode) => {
      if (result[agentId]) result[agentId].permissions.push(mode);
      else
        result[agentId] = {
          id: agentId,
          predicate: predicate,
          permissions: [mode]
        };
    };
    if (permissions) {
      for (const p of permissions) {
        if (p[(0, $09c536abc6cea017$export$2703254089a859eb)])
          (0, $2d06940433ec0c6c$export$dca4f48302963835)(p[(0, $09c536abc6cea017$export$2703254089a859eb)]).forEach(
            agentId => appendPermission(agentId, (0, $09c536abc6cea017$export$2703254089a859eb), p['acl:mode'])
          );
        if (p[(0, $09c536abc6cea017$export$97a08a1bb7ee0545)])
          (0, $2d06940433ec0c6c$export$dca4f48302963835)(p[(0, $09c536abc6cea017$export$97a08a1bb7ee0545)]).forEach(
            userUri => appendPermission(userUri, (0, $09c536abc6cea017$export$97a08a1bb7ee0545), p['acl:mode'])
          );
        if (p[(0, $09c536abc6cea017$export$f07ccbe0773f2c7)])
          (0, $2d06940433ec0c6c$export$dca4f48302963835)(p[(0, $09c536abc6cea017$export$f07ccbe0773f2c7)]).forEach(
            groupUri => appendPermission(groupUri, (0, $09c536abc6cea017$export$f07ccbe0773f2c7), p['acl:mode'])
          );
      }
      setAgents(result);
    }
  }, [permissions]);
  const addPermission = (0, $4Uj5b$react.useCallback)(
    (agentId, predicate, mode) => {
      const prevAgents = {
        ...agents
      };
      setAgents({
        ...agents,
        [agentId]: {
          id: agentId,
          predicate: predicate,
          permissions: agents[agentId] ? [...agents[agentId]?.permissions, mode] : [mode]
        }
      });
      authProvider.addPermission(uri, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
  );
  const removePermission = (0, $4Uj5b$react.useCallback)(
    (agentId, predicate, mode) => {
      const prevAgents = {
        ...agents
      };
      setAgents(
        Object.fromEntries(
          Object.entries(agents)
            .map(([key, agent]) => {
              if (agent.id === agentId) agent.permissions = agent.permissions.filter(m => m !== mode);
              return [key, agent];
            }) // Remove agents if they have no permissions (except if they are class agents)
            .filter(
              ([_, agent]) =>
                agent.predicate === (0, $09c536abc6cea017$export$2703254089a859eb) || agent.permissions.length > 0
            )
        )
      );
      authProvider.removePermission(uri, agentId, predicate, mode).catch(e => {
        // If there was an error, revert the optimistic update
        setAgents(prevAgents);
      });
    },
    [agents, setAgents, uri, authProvider]
  );
  return {
    agents: agents,
    addPermission: addPermission,
    removePermission: removePermission
  };
};
var $780e01b2b2982de2$export$2e2bcd8739ae039 = $780e01b2b2982de2$var$useAgents;

const $eb7f8a6f7bf44740$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(() => ({
  title: {
    paddingBottom: 8
  },
  actions: {
    padding: 15
  },
  addForm: {
    paddingTop: 0
  },
  listForm: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    maxHeight: 210
  }
}));
const $eb7f8a6f7bf44740$var$PermissionsDialog = ({
  open: open,
  onClose: onClose,
  uri: uri,
  isContainer: isContainer
}) => {
  const classes = $eb7f8a6f7bf44740$var$useStyles();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const {
    agents: agents,
    addPermission: addPermission,
    removePermission: removePermission
  } = (0, $780e01b2b2982de2$export$2e2bcd8739ae039)(uri);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Dialog), {
    fullWidth: true,
    open: open,
    onClose: onClose,
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogTitle), {
        className: classes.title,
        children: translate(isContainer ? 'auth.dialog.container_permissions' : 'auth.dialog.resource_permissions')
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
        className: classes.addForm,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $a613ad42a03b1bc4$export$2e2bcd8739ae039), {
          agents: agents,
          addPermission: addPermission
        })
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
        className: classes.listForm,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $6bcadc28bc94109b$export$2e2bcd8739ae039), {
          isContainer: isContainer,
          agents: agents,
          addPermission: addPermission,
          removePermission: removePermission
        })
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogActions), {
        className: classes.actions,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Button), {
          label: 'ra.action.close',
          variant: 'text',
          onClick: onClose
        })
      })
    ]
  });
};
var $eb7f8a6f7bf44740$export$2e2bcd8739ae039 = $eb7f8a6f7bf44740$var$PermissionsDialog;

const $49d4f2fbe6f28cfd$var$PermissionsButton = ({ isContainer: isContainer }) => {
  const record = (0, $4Uj5b$reactadmin.useRecordContext)();
  const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
  const [showDialog, setShowDialog] = (0, $4Uj5b$react.useState)(false);
  const createContainer = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainer)(resource);
  const uri = isContainer ? createContainer : record.id || record['@id'];
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Button), {
        label: 'auth.action.permissions',
        onClick: () => setShowDialog(true),
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
          (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialShare)),
          {}
        )
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $eb7f8a6f7bf44740$export$2e2bcd8739ae039), {
        uri: uri,
        isContainer: isContainer,
        open: showDialog,
        onClose: () => setShowDialog(false)
      })
    ]
  });
};
$49d4f2fbe6f28cfd$var$PermissionsButton.defaultProps = {
  isContainer: false
};
var $49d4f2fbe6f28cfd$export$2e2bcd8739ae039 = $49d4f2fbe6f28cfd$var$PermissionsButton;

const $87767302443de17c$var$EditActionsWithPermissions = () => {
  const { hasList: hasList, hasShow: hasShow } = (0, $4Uj5b$reactadmin.useResourceDefinition)();
  const record = (0, $4Uj5b$reactadmin.useRecordContext)();
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(record?.id);
  const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
  const containerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)()(resource);
  const { permissions: containerPermissions } = (0, $4Uj5b$reactadmin.usePermissions)(containerUri);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
    children: [
      hasList &&
        containerPermissions &&
        containerPermissions.some(p => (0, $09c536abc6cea017$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ListButton), {}),
      hasShow &&
        permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$d37f0098bcf84c55).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ShowButton), {}),
      permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $49d4f2fbe6f28cfd$export$2e2bcd8739ae039), {})
    ]
  });
};
var $87767302443de17c$export$2e2bcd8739ae039 = $87767302443de17c$var$EditActionsWithPermissions;

const $79bac4913d414938$var$DeleteButtonWithPermissions = props => {
  const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
  const { permissions: permissions, isLoading: isLoading } = (0, $4Uj5b$reactadmin.usePermissions)(recordId);
  if (!isLoading && permissions?.some(p => (0, $09c536abc6cea017$export$ac7b0367c0f9031e).includes(p['acl:mode'])))
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.DeleteButton), {
      ...props
    });
  return null;
};
var $79bac4913d414938$export$2e2bcd8739ae039 = $79bac4913d414938$var$DeleteButtonWithPermissions;

const $41feb0ed0192b62e$var$StyledToolbar = (0, $4Uj5b$muimaterialstyles.styled)((0, $4Uj5b$reactadmin.Toolbar))(
  () => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  })
);
const $41feb0ed0192b62e$var$EditToolbarWithPermissions = props =>
  /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)($41feb0ed0192b62e$var$StyledToolbar, {
    ...props,
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.SaveButton), {}),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $79bac4913d414938$export$2e2bcd8739ae039), {})
    ]
  });
var $41feb0ed0192b62e$export$2e2bcd8739ae039 = $41feb0ed0192b62e$var$EditToolbarWithPermissions;

const $6f1389d03e4735d1$var$EditWithPermissions = props => {
  const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
  (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(recordId, 'edit');
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Edit), {
    ...props,
    children: /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(props.children, {
      toolbar: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $41feb0ed0192b62e$export$2e2bcd8739ae039), {}),
      // Allow to override toolbar
      ...props.children.props
    })
  });
};
$6f1389d03e4735d1$var$EditWithPermissions.defaultProps = {
  actions: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $87767302443de17c$export$2e2bcd8739ae039), {})
};
var $6f1389d03e4735d1$export$2e2bcd8739ae039 = $6f1389d03e4735d1$var$EditWithPermissions;

const $496e40eed9f00a2c$var$EditButtonWithPermissions = props => {
  const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
  const { permissions: permissions, isLoading: isLoading } = (0, $4Uj5b$reactadmin.usePermissions)(recordId);
  if (!isLoading && permissions?.some(p => (0, $09c536abc6cea017$export$b9d0f5f3ab5e453b).includes(p['acl:mode'])))
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.EditButton), {
      ...props
    });
  return null;
};
var $496e40eed9f00a2c$export$2e2bcd8739ae039 = $496e40eed9f00a2c$var$EditButtonWithPermissions;

// Do not show Export and Refresh buttons on mobile
const $6452f20f9b47ebd6$var$ListActionsWithPermissions = ({
  bulkActions: bulkActions,
  sort: sort,
  displayedFilters: displayedFilters,
  exporter: exporter,
  filters: filters,
  filterValues: filterValues,
  onUnselectItems: onUnselectItems,
  selectedIds: selectedIds,
  showFilter: showFilter,
  total: total
}) => {
  const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
  const xs = (0, $4Uj5b$muimaterial.useMediaQuery)(theme => theme.breakpoints.down('xs'));
  const resourceDefinition = (0, $4Uj5b$reactadmin.useResourceDefinition)();
  const createContainerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainer)(resource);
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(createContainerUri);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
    children: [
      filters &&
        /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(filters, {
          showFilter: showFilter,
          displayedFilters: displayedFilters,
          filterValues: filterValues,
          context: 'button'
        }),
      resourceDefinition.hasCreate &&
        permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$65615a101bd6f5ca).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.CreateButton), {}),
      permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $49d4f2fbe6f28cfd$export$2e2bcd8739ae039), {
          isContainer: true
        }),
      !xs &&
        exporter !== false &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ExportButton), {
          disabled: total === 0,
          sort: sort,
          filter: filterValues,
          exporter: exporter
        }),
      bulkActions &&
        /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(bulkActions, {
          filterValues: filterValues,
          selectedIds: selectedIds,
          onUnselectItems: onUnselectItems
        })
    ]
  });
};
var $6452f20f9b47ebd6$export$2e2bcd8739ae039 = $6452f20f9b47ebd6$var$ListActionsWithPermissions;

const $15811bcd3a3eb59f$var$ListWithPermissions = props =>
  /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.List), {
    ...props
  });
$15811bcd3a3eb59f$var$ListWithPermissions.defaultProps = {
  actions: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $6452f20f9b47ebd6$export$2e2bcd8739ae039), {})
};
var $15811bcd3a3eb59f$export$2e2bcd8739ae039 = $15811bcd3a3eb59f$var$ListWithPermissions;

const $43f4d313e20b20c2$var$ShowActionsWithPermissions = () => {
  const { hasList: hasList, hasEdit: hasEdit } = (0, $4Uj5b$reactadmin.useResourceDefinition)();
  const record = (0, $4Uj5b$reactadmin.useRecordContext)();
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(record?.id);
  const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
  const containerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)()(resource);
  const { permissions: containerPermissions } = (0, $4Uj5b$reactadmin.usePermissions)(containerUri);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
    children: [
      hasList &&
        containerPermissions &&
        containerPermissions.some(p => (0, $09c536abc6cea017$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ListButton), {}),
      hasEdit &&
        permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$b9d0f5f3ab5e453b).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.EditButton), {}),
      permissions &&
        permissions.some(p => (0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) &&
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $49d4f2fbe6f28cfd$export$2e2bcd8739ae039), {})
    ]
  });
};
var $43f4d313e20b20c2$export$2e2bcd8739ae039 = $43f4d313e20b20c2$var$ShowActionsWithPermissions;

const $773eb052716d0fa7$var$ShowWithPermissions = props => {
  const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
  (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(recordId, 'show');
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Show), {
    ...props
  });
};
$773eb052716d0fa7$var$ShowWithPermissions.defaultProps = {
  actions: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $43f4d313e20b20c2$export$2e2bcd8739ae039), {})
};
var $773eb052716d0fa7$export$2e2bcd8739ae039 = $773eb052716d0fa7$var$ShowWithPermissions;

const $4e0bf9be00aaa242$var$AuthDialog = ({
  open: open,
  onClose: onClose,
  title: title,
  message: message,
  redirect: redirect,
  ...rest
}) => {
  const login = (0, $4Uj5b$reactadmin.useLogin)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Dialog), {
    open: open,
    onClose: onClose,
    ...rest,
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogTitle), {
        children: translate(title)
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContentText), {
          children: translate(message)
        })
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.DialogActions), {
        children: [
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
            onClick: onClose,
            children: translate('ra.action.cancel')
          }),
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
            onClick: () =>
              login({
                redirect: redirect || window.location.pathname + window.location.search
              }),
            color: 'primary',
            variant: 'contained',
            children: translate('auth.action.login')
          })
        ]
      })
    ]
  });
};
$4e0bf9be00aaa242$var$AuthDialog.defaultProps = {
  title: 'auth.dialog.login_required',
  message: 'auth.message.login_to_continue'
};
var $4e0bf9be00aaa242$export$2e2bcd8739ae039 = $4e0bf9be00aaa242$var$AuthDialog;

const $0af8eee27f6a6e9f$var$delay = async t => new Promise(resolve => setTimeout(resolve, t));
// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const $0af8eee27f6a6e9f$var$SsoLoginPage = ({
  children: children,
  backgroundImage: backgroundImage,
  buttons: buttons,
  userResource: userResource,
  propertiesExist: propertiesExist,
  text: text,
  ...rest
}) => {
  const containerRef = (0, $4Uj5b$react.useRef)();
  let backgroundImageLoaded = false;
  const navigate = (0, $4Uj5b$reactrouterdom.useNavigate)();
  const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
  const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const login = (0, $4Uj5b$reactadmin.useLogin)();
  const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
  const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
  (0, $4Uj5b$react.useEffect)(() => {
    if (!isLoading && identity?.id)
      // Already authenticated, redirect to the home page
      navigate(searchParams.get('redirect') || '/');
  }, [identity, isLoading, navigate, searchParams]);
  (0, $4Uj5b$react.useEffect)(() => {
    (async () => {
      if (searchParams.has('login')) {
        if (searchParams.has('error')) {
          if (searchParams.get('error') === 'registration.not-allowed')
            notify('auth.message.user_email_not_found', {
              type: 'error'
            });
          else
            notify('auth.message.bad_request', {
              type: 'error',
              messageArgs: {
                error: searchParams.get('error')
              }
            });
        } else if (searchParams.has('token')) {
          const token = searchParams.get('token');
          const { webId: webId } = (0, $parcel$interopDefault($4Uj5b$jwtdecode))(token);
          localStorage.setItem('token', token);
          let userData;
          ({ data: userData } = await dataProvider.getOne(userResource, {
            id: webId
          }));
          if (propertiesExist.length > 0) {
            let allPropertiesExist = propertiesExist.every(p => userData[p]);
            while (!allPropertiesExist) {
              console.log('Waiting for all properties to have been created', propertiesExist);
              await $0af8eee27f6a6e9f$var$delay(500);
              ({ data: userData } = await dataProvider.getOne(userResource, {
                id: webId
              }));
              allPropertiesExist = propertiesExist.every(p => userData[p]);
            }
          }
          if (!authProvider.checkUser(userData)) {
            localStorage.removeItem('token');
            notify('auth.message.user_not_allowed_to_login', {
              type: 'error'
            });
            navigate.replace('/login');
          } else if (searchParams.has('redirect')) {
            notify('auth.message.user_connected', {
              type: 'info'
            });
            window.location.href = searchParams.get('redirect');
          } else if (searchParams.has('new') && searchParams.get('new') === 'true') {
            notify('auth.message.new_user_created', {
              type: 'info'
            });
            window.location.href = `/${userResource}/${encodeURIComponent(webId)}`;
          } else {
            notify('auth.message.user_connected', {
              type: 'info'
            });
            window.location.href = '/';
          }
        }
      }
      if (searchParams.has('logout')) {
        // Delete token and any other value in local storage
        localStorage.clear();
        notify('auth.message.user_disconnected', {
          type: 'info'
        });
        navigate('/');
      }
    })();
  }, [searchParams, navigate, notify, userResource]);
  const updateBackgroundImage = () => {
    if (!backgroundImageLoaded && containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
      backgroundImageLoaded = true;
    }
  };
  // Load background image asynchronously to speed up time to interactive
  const lazyLoadBackgroundImage = () => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = updateBackgroundImage;
      img.src = backgroundImage;
    }
  };
  (0, $4Uj5b$react.useEffect)(() => {
    if (!backgroundImageLoaded) lazyLoadBackgroundImage();
  });
  if (isLoading) return null;
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($0af8eee27f6a6e9f$var$Root, {
    ...rest,
    ref: containerRef,
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
      className: $0af8eee27f6a6e9f$export$388de65c72fa74b4.card,
      children: [
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)('div', {
          className: $0af8eee27f6a6e9f$export$388de65c72fa74b4.avatar,
          children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
            className: $0af8eee27f6a6e9f$export$388de65c72fa74b4.icon,
            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialLock)),
              {}
            )
          })
        }),
        text &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
            variant: 'body2' /* className={classes.text} */,
            children: text
          }),
        buttons?.map((button, i) =>
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
            (0, $4Uj5b$muimaterial.CardActions),
            {
              children: /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(button, {
                fullWidth: true,
                variant: 'outlined',
                type: 'submit',
                onClick: () => login({}, '/login')
              })
            },
            i
          )
        )
      ]
    })
  });
};
const $0af8eee27f6a6e9f$var$PREFIX = 'SsoLoginPage';
const $0af8eee27f6a6e9f$export$388de65c72fa74b4 = {
  card: `${$0af8eee27f6a6e9f$var$PREFIX}-card`,
  avatar: `${$0af8eee27f6a6e9f$var$PREFIX}-avatar`,
  icon: `${$0af8eee27f6a6e9f$var$PREFIX}-icon`,
  switch: `${$0af8eee27f6a6e9f$var$PREFIX}-switch`
};
const $0af8eee27f6a6e9f$var$Root = (0, $4Uj5b$muimaterialstyles.styled)('div', {
  name: $0af8eee27f6a6e9f$var$PREFIX,
  overridesResolver: (props, styles) => styles.root
})(({ theme: theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  height: '1px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
  [`& .${$0af8eee27f6a6e9f$export$388de65c72fa74b4.card}`]: {
    minWidth: 300,
    marginTop: '6em'
  },
  [`& .${$0af8eee27f6a6e9f$export$388de65c72fa74b4.avatar}`]: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center'
  },
  [`& .${$0af8eee27f6a6e9f$export$388de65c72fa74b4.icon}`]: {
    backgroundColor: theme.palette.secondary[500]
  },
  [`& .${$0af8eee27f6a6e9f$export$388de65c72fa74b4.switch}`]: {
    marginBottom: '1em',
    display: 'flex',
    justifyContent: 'center'
  }
}));
$0af8eee27f6a6e9f$var$SsoLoginPage.defaultProps = {
  propertiesExist: [],
  // TODO deprecate this
  buttons: [
    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
      startIcon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
        src: '/lescommuns.jpg'
      }),
      children: 'Les Communs'
    })
  ],
  userResource: 'Person'
};
var $0af8eee27f6a6e9f$export$2e2bcd8739ae039 = $0af8eee27f6a6e9f$var$SsoLoginPage;

const $19e4629c708b7a3e$var$useSignup = () => {
  const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
  return (0, $4Uj5b$react.useCallback)((params = {}) => authProvider.signup(params), [authProvider]);
};
var $19e4629c708b7a3e$export$2e2bcd8739ae039 = $19e4629c708b7a3e$var$useSignup;

// Call a custom endpoint to tell the OIDC server the login is completed
const $e5ab9cca64b9eee5$var$useLoginCompleted = () => {
  const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
  return (0, $4Uj5b$react.useCallback)(async interactionId => {
    const authServerUrl = await (0, $2d06940433ec0c6c$export$274217e117cdbc7b)(dataProvider);
    console.log('login completed', authServerUrl, interactionId);
    await dataProvider.fetch((0, $parcel$interopDefault($4Uj5b$urljoin))(authServerUrl, '.oidc/login-completed'), {
      method: 'POST',
      body: JSON.stringify({
        interactionId: interactionId
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  });
};
var $e5ab9cca64b9eee5$export$2e2bcd8739ae039 = $e5ab9cca64b9eee5$var$useLoginCompleted;

// Inspired by https://github.com/bartlomiejzuber/password-strength-score
/**
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Required characters for a very long password (default: 12)
 * @property {number} isLongLength - Required characters for a long password (default: 6)
 * @property {number} isVeryLongScore - Score for a very long password (default: 2.5)
 * @property {number} isLongScore - Score for a long password (default: 1.5)
 * @property {number} uppercaseScore - Score for a password with uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for a password with lowercase letters (default: 1)
 * @property {number} numbersScore - Score for a password with numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for a password without non-alphanumeric characters (default: 1)
 */ /** @type {PasswordStrengthOptions} */ const $d1ca1e1d215e32ca$export$ba43bf67f3d48107 = {
  isVeryLongLength: 14,
  isLongLength: 8,
  isLongScore: 2,
  isVeryLongScore: 4,
  uppercaseScore: 1,
  lowercaseScore: 1,
  numbersScore: 1,
  nonAlphanumericsScore: 1
};
const $d1ca1e1d215e32ca$export$963a5c59734509bb = (password, options) => {
  if (!password) return 0;
  const mergedOptions = {
    ...$d1ca1e1d215e32ca$export$ba43bf67f3d48107,
    ...options
  };
  const longScore = (password.length >= mergedOptions.isLongLength && mergedOptions.isLongScore) || 0;
  const veryLongScore = (password.length >= mergedOptions.isVeryLongLength && mergedOptions.isVeryLongScore) || 0;
  const lowercaseScore = (/[a-z]/.test(password) && mergedOptions.lowercaseScore) || 0;
  const uppercaseScore = (/[A-Z]/.test(password) && mergedOptions.uppercaseScore) || 0;
  const numbersScore = (/\d/.test(password) && mergedOptions.numbersScore) || 0;
  const nonalphasScore = (/\W/.test(password) && mergedOptions.nonAlphanumericsScore) || 0;
  return uppercaseScore + lowercaseScore + numbersScore + nonalphasScore + longScore + veryLongScore;
};
const $d1ca1e1d215e32ca$export$a1d713a9155d58fc = (
  options = $d1ca1e1d215e32ca$export$ba43bf67f3d48107,
  minRequiredScore = 5
) => {
  const mergedOptions = {
    ...$d1ca1e1d215e32ca$export$ba43bf67f3d48107,
    ...options
  };
  return {
    scoreFn: password => $d1ca1e1d215e32ca$export$963a5c59734509bb(password, mergedOptions),
    minRequiredScore: minRequiredScore,
    maxScore:
      mergedOptions.uppercaseScore +
      mergedOptions.lowercaseScore +
      mergedOptions.numbersScore +
      mergedOptions.nonAlphanumericsScore +
      mergedOptions.isLongScore +
      mergedOptions.isVeryLongScore
  };
};
const $d1ca1e1d215e32ca$export$19dcdb21c6965fb8 = $d1ca1e1d215e32ca$export$a1d713a9155d58fc(
  $d1ca1e1d215e32ca$export$ba43bf67f3d48107,
  5
);

const $eab41bc89667b2c6$var$validatePasswordStrength =
  (scorer = (0, $d1ca1e1d215e32ca$export$19dcdb21c6965fb8)) =>
  value => {
    if (!scorer) return undefined;
    const strength = scorer.scoreFn(value);
    if (strength < scorer.minRequiredScore) return 'auth.input.password_too_weak';
    return undefined;
  };
var $eab41bc89667b2c6$export$2e2bcd8739ae039 = $eab41bc89667b2c6$var$validatePasswordStrength;

/**
 * @typedef {object} Color
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */ /**
 * Calculate a rgb-color from a gradient between `color1` and `color2`
 * @param {number} fade - Indicates the fade between `color1` and `color2` in the range [0, 1].
 * @param {Color} color1
 * @param {Color} color2
 * @returns {string} `` `rgb(${red}, ${green}, ${blue})` ``
 */ const $bd29744006fdc23c$var$colorGradient = (fade, color1, color2) => {
  const diffRed = color2.red - color1.red;
  const diffGreen = color2.green - color1.green;
  const diffBlue = color2.blue - color1.blue;
  const gradient = {
    red: Math.floor(color1.red + diffRed * fade),
    green: Math.floor(color1.green + diffGreen * fade),
    blue: Math.floor(color1.blue + diffBlue * fade)
  };
  return `rgb(${gradient.red},${gradient.green},${gradient.blue})`;
};
function $bd29744006fdc23c$export$2e2bcd8739ae039(props) {
  const {
    minVal: minVal,
    maxVal: maxVal,
    currentVal: currentVal,
    badColor: badColor,
    goodColor: goodColor,
    ...restProps
  } = props;
  const color1 = badColor || {
    red: 0xff,
    green: 0x40,
    blue: 0x47
  };
  const color2 = goodColor || {
    red: 0x00,
    green: 0xff,
    blue: 0x6e
  };
  const fade = Math.max(0, Math.min(1, (currentVal - minVal) / (maxVal - minVal)));
  const currentColor = $bd29744006fdc23c$var$colorGradient(fade, color1, color2);
  const StyledLinearProgress = (0, $4Uj5b$muistyles.withStyles)({
    colorPrimary: {
      backgroundColor: 'black' // '#e0e0e0'
    },
    barColorPrimary: {
      backgroundColor: currentColor
    }
  })((0, $4Uj5b$muimaterial.LinearProgress));
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(StyledLinearProgress, {
    ...restProps,
    value: 100 * fade,
    variant: 'determinate'
  });
}

function $edfec7f9e9fd7881$export$2e2bcd8739ae039({
  scorer: scorer = (0, $d1ca1e1d215e32ca$export$19dcdb21c6965fb8),
  password: password,
  ...restProps
}) {
  const strength = scorer.scoreFn(password);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $bd29744006fdc23c$export$2e2bcd8739ae039), {
    currentVal: strength,
    minVal: 0,
    maxVal: scorer.maxScore,
    ...restProps
  });
}

const $cd7709c431b14d14$var$USED_SEARCH_PARAMS = ['signup', 'reset_password', 'new_password', 'email', 'force-email'];
const $cd7709c431b14d14$var$getSearchParamsRest = searchParams => {
  const rest = [];
  for (const [key, value] of searchParams.entries())
    if (!$cd7709c431b14d14$var$USED_SEARCH_PARAMS.includes(key)) rest.push(`${key}=${encodeURIComponent(value)}`);
  return rest.length > 0 ? rest.join('&') : '';
};
var $cd7709c431b14d14$export$2e2bcd8739ae039 = $cd7709c431b14d14$var$getSearchParamsRest;

const $5f70c240e5b0340c$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(theme => ({
  content: {
    width: 450
  },
  icon: {
    margin: theme.spacing(0.3)
  }
}));
/**
 * @param postSignupRedirect
 * @param additionalSignupValues
 * @param delayBeforeRedirect
 * @param {string} redirectTo
 * @param {object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $5f70c240e5b0340c$var$SignupForm = ({
  passwordScorer: passwordScorer = (0, $d1ca1e1d215e32ca$export$19dcdb21c6965fb8),
  postSignupRedirect: postSignupRedirect,
  additionalSignupValues: additionalSignupValues,
  delayBeforeRedirect: delayBeforeRedirect = 0
}) => {
  const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
  const signup = (0, $19e4629c708b7a3e$export$2e2bcd8739ae039)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const classes = $5f70c240e5b0340c$var$useStyles();
  const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
  const loginCompleted = (0, $e5ab9cca64b9eee5$export$2e2bcd8739ae039)();
  const interactionId = searchParams.get('interaction_id');
  const redirectTo = postSignupRedirect
    ? `${postSignupRedirect}?${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`
    : searchParams.get('redirect') || '/';
  const [locale] = (0, $4Uj5b$reactadmin.useLocaleState)();
  const [password, setPassword] = (0, $4Uj5b$react.useState)('');
  const submit = (0, $4Uj5b$react.useCallback)(
    async values => {
      try {
        setLoading(true);
        await signup({
          ...values,
          ...additionalSignupValues
        });
        // If interactionId is set, it means we are connecting from another application.
        // So call a custom endpoint to tell the OIDC server the login is completed
        if (interactionId) await loginCompleted(interactionId);
        setTimeout(() => {
          // TODO now that we have the refreshConfig method, see if we can avoid a hard reload
          // window.location.reload();
          window.location.href = redirectTo;
          setLoading(false);
        }, delayBeforeRedirect);
        notify('auth.message.new_user_created', {
          type: 'info'
        });
      } catch (e) {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
              ? 'ra.auth.sign_in_error'
              : error.message,
          {
            type: 'warning',
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
          }
        );
      }
    },
    [setLoading, signup, additionalSignupValues, redirectTo, notify, interactionId, loginCompleted]
  );
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
    onSubmit: submit,
    noValidate: true,
    defaultValues: {
      email: searchParams.get('email')
    },
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
      className: classes.content,
      children: [
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          autoFocus: true,
          source: 'username',
          label: translate('auth.input.username'),
          autoComplete: 'username',
          fullWidth: true,
          disabled: loading,
          validate: [(0, $4Uj5b$reactadmin.required)(), (0, $4Uj5b$reactadmin.minLength)(2)],
          format: value =>
            value
              ? (0, $parcel$interopDefault($4Uj5b$speakingurl))(value, {
                  lang: locale || 'fr',
                  separator: '_',
                  custom: ['.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                })
              : ''
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          source: 'email',
          label: translate('auth.input.email'),
          autoComplete: 'email',
          fullWidth: true,
          disabled: loading || (searchParams.has('email') && searchParams.has('force-email')),
          validate: [(0, $4Uj5b$reactadmin.required)(), (0, $4Uj5b$reactadmin.email)()]
        }),
        passwordScorer &&
          password &&
          !(searchParams.has('email') && searchParams.has('force-email')) &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
            children: [
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
                variant: 'caption',
                style: {
                  marginBottom: 3
                },
                children: [translate('auth.input.password_strength'), ':', ' ']
              }),
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $edfec7f9e9fd7881$export$2e2bcd8739ae039), {
                password: password,
                scorer: passwordScorer,
                sx: {
                  width: '100%'
                }
              })
            ]
          }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          source: 'password',
          type: 'password',
          value: password,
          onChange: e => setPassword(e.target.value),
          label: translate('ra.auth.password'),
          autoComplete: 'new-password',
          fullWidth: true,
          disabled: loading || (searchParams.has('email') && searchParams.has('force-email')),
          validate: [(0, $4Uj5b$reactadmin.required)(), (0, $eab41bc89667b2c6$export$2e2bcd8739ae039)(passwordScorer)]
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
          variant: 'contained',
          type: 'submit',
          color: 'primary',
          disabled: loading,
          fullWidth: true,
          className: classes.button,
          children: loading
            ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.CircularProgress), {
                className: classes.icon,
                size: 19,
                thickness: 3
              })
            : translate('auth.action.signup')
        })
      ]
    })
  });
};
$5f70c240e5b0340c$var$SignupForm.defaultValues = {
  redirectTo: '/',
  additionalSignupValues: {}
};
var $5f70c240e5b0340c$export$2e2bcd8739ae039 = $5f70c240e5b0340c$var$SignupForm;

const $8a2df01c9f2675bb$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(theme => ({
  content: {
    width: 450
  },
  icon: {
    margin: theme.spacing(0.3)
  }
}));
const $8a2df01c9f2675bb$var$LoginForm = ({ postLoginRedirect: postLoginRedirect, allowUsername: allowUsername }) => {
  const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
  const login = (0, $4Uj5b$reactadmin.useLogin)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const classes = $8a2df01c9f2675bb$var$useStyles();
  const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
  const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
  const loginCompleted = (0, $e5ab9cca64b9eee5$export$2e2bcd8739ae039)();
  const interactionId = searchParams.get('interaction_id');
  const redirectTo = postLoginRedirect
    ? `${postLoginRedirect}?${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`
    : searchParams.get('redirect');
  const submit = (0, $4Uj5b$react.useCallback)(
    async values => {
      try {
        setLoading(true);
        await login(values);
        // If interactionId is set, it means we are connecting from another application.
        // So call a custom endpoint to tell the OIDC server the login is completed
        if (interactionId) await loginCompleted(interactionId);
        setLoading(false);
        // TODO now that we have the refreshConfig method, see if we can avoid a hard reload
        // window.location.reload();
        window.location.href = redirectTo;
      } catch (e) {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
              ? 'ra.auth.sign_in_error'
              : error.message,
          {
            type: 'warning',
            messageArgs: {
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
      }
    },
    [setLoading, login, redirectTo, notify, interactionId, dataProvider]
  );
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
    onSubmit: submit,
    noValidate: true,
    defaultValues: {
      username: searchParams.get('email')
    },
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
      className: classes.content,
      children: [
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          source: 'username',
          label: translate(allowUsername ? 'auth.input.username_or_email' : 'auth.input.email'),
          autoComplete: 'email',
          fullWidth: true,
          disabled: loading || (searchParams.has('email') && searchParams.has('force-email')),
          format: value => (value ? value.toLowerCase() : ''),
          validate: allowUsername
            ? [(0, $4Uj5b$reactadmin.required)()]
            : [(0, $4Uj5b$reactadmin.required)(), (0, $4Uj5b$reactadmin.email)()]
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          source: 'password',
          type: 'password',
          label: translate('ra.auth.password'),
          autoComplete: 'current-password',
          fullWidth: true,
          disabled: loading || (searchParams.has('email') && searchParams.has('force-email')),
          validate: (0, $4Uj5b$reactadmin.required)()
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
          variant: 'contained',
          type: 'submit',
          color: 'primary',
          disabled: loading,
          fullWidth: true,
          className: classes.button,
          children: loading
            ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.CircularProgress), {
                className: classes.icon,
                size: 19,
                thickness: 3
              })
            : translate('auth.action.login')
        })
      ]
    })
  });
};
$8a2df01c9f2675bb$var$LoginForm.defaultValues = {
  redirectTo: '/',
  allowUsername: false
};
var $8a2df01c9f2675bb$export$2e2bcd8739ae039 = $8a2df01c9f2675bb$var$LoginForm;

const $176df6bd8edc5f4d$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(theme => ({
  icon: {
    margin: theme.spacing(0.3)
  }
}));
const $176df6bd8edc5f4d$var$samePassword = (value, allValues) => {
  if (value && value !== allValues.password) return 'Mot de passe diff\xe9rent du premier';
};
/**
 *
 * @param {string} redirectTo
 * @param {Object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $176df6bd8edc5f4d$var$NewPasswordForm = ({
  redirectTo: redirectTo,
  passwordScorer: passwordScorer = (0, $d1ca1e1d215e32ca$export$19dcdb21c6965fb8)
}) => {
  const location = (0, $4Uj5b$reactrouterdom.useLocation)();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
  const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const classes = $176df6bd8edc5f4d$var$useStyles();
  const [newPassword, setNewPassword] = (0, $4Uj5b$react.useState)('');
  const submit = values => {
    setLoading(true);
    authProvider
      .setNewPassword({
        ...values,
        token: token
      })
      .then(() => {
        setTimeout(() => {
          const url = new URL('/login', window.location.origin);
          if (redirectTo) url.searchParams.append('redirect', redirectTo);
          url.searchParams.append('email', values.email);
          window.location.href = url.toString();
          setLoading(false);
        }, 2000);
        notify('auth.notification.password_changed', {
          type: 'info'
        });
      })
      .catch(error => {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
              ? 'auth.notification.reset_password_error'
              : error.message,
          {
            type: 'warning',
            messageArgs: {
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
      });
  };
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
    onSubmit: submit,
    noValidate: true,
    defaultValues: {
      email: searchParams.get('email')
    },
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
      className: classes.content,
      children: [
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          autoFocus: true,
          source: 'email',
          label: translate('auth.input.email'),
          autoComplete: 'email',
          fullWidth: true,
          disabled: loading,
          validate: (0, $4Uj5b$reactadmin.required)(),
          format: value => (value ? value.toLowerCase() : '')
        }),
        passwordScorer &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
            children: [
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
                variant: 'caption',
                style: {
                  marginBottom: 3
                },
                children: [translate('auth.input.password_strength'), ':', ' ']
              }),
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $edfec7f9e9fd7881$export$2e2bcd8739ae039), {
                password: newPassword,
                scorer: passwordScorer,
                sx: {
                  width: '100%'
                }
              })
            ]
          }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          autoFocus: true,
          type: 'password',
          source: 'password',
          value: newPassword,
          label: translate('auth.input.new_password'),
          autoComplete: 'current-password',
          fullWidth: true,
          disabled: loading,
          validate: [(0, $4Uj5b$reactadmin.required)(), (0, $eab41bc89667b2c6$export$2e2bcd8739ae039)(passwordScorer)],
          onChange: e => setNewPassword(e.target.value)
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          type: 'password',
          source: 'confirm-password',
          label: translate('auth.input.confirm_new_password'),
          autoComplete: 'current-password',
          fullWidth: true,
          disabled: loading,
          validate: [(0, $4Uj5b$reactadmin.required)(), $176df6bd8edc5f4d$var$samePassword]
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
          variant: 'contained',
          type: 'submit',
          color: 'primary',
          disabled: loading,
          fullWidth: true,
          className: classes.button,
          children: loading
            ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.CircularProgress), {
                className: classes.icon,
                size: 19,
                thickness: 3
              })
            : translate('auth.action.set_new_password')
        })
      ]
    })
  });
};
var $176df6bd8edc5f4d$export$2e2bcd8739ae039 = $176df6bd8edc5f4d$var$NewPasswordForm;

const $a04debd4e4af2a01$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(theme => ({
  icon: {
    margin: theme.spacing(0.3)
  }
}));
const $a04debd4e4af2a01$var$ResetPasswordForm = () => {
  const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
  const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const classes = $a04debd4e4af2a01$var$useStyles();
  const submit = values => {
    setLoading(true);
    authProvider
      .resetPassword({
        ...values
      })
      .then(res => {
        setLoading(false);
        notify('auth.notification.reset_password_submitted', {
          type: 'info'
        });
      })
      .catch(error => {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
              ? 'auth.notification.reset_password_error'
              : error.message,
          {
            type: 'warning',
            messageArgs: {
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
      });
  };
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
    onSubmit: submit,
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
      className: classes.content,
      children: [
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
          autoFocus: true,
          source: 'email',
          label: translate('auth.input.email'),
          autoComplete: 'email',
          fullWidth: true,
          disabled: loading,
          validate: (0, $4Uj5b$reactadmin.required)(),
          format: value => (value ? value.toLowerCase() : '')
        }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
          variant: 'contained',
          type: 'submit',
          color: 'primary',
          disabled: loading,
          fullWidth: true,
          className: classes.button,
          children: loading
            ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.CircularProgress), {
                className: classes.icon,
                size: 19,
                thickness: 3
              })
            : translate('auth.action.submit')
        })
      ]
    })
  });
};
var $a04debd4e4af2a01$export$2e2bcd8739ae039 = $a04debd4e4af2a01$var$ResetPasswordForm;

const $d6b5c702311394c4$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.secondary.main
    }
  },
  root: {
    backgroundColor: theme.palette.secondary.main
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    marginTop: '6em',
    [theme.breakpoints.down('sm')]: {
      margin: '1em'
    }
  },
  icon: {
    marginTop: 5,
    marginRight: 5
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontWeight: 'bold',
      marginTop: 12
    }
  }
}));
const $d6b5c702311394c4$var$SimpleBox = ({ title: title, icon: icon, text: text, children: children }) => {
  const classes = $d6b5c702311394c4$var$useStyles();
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Box), {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    className: classes.root,
    children: [
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
        className: classes.card,
        children: [
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Box), {
            p: 2,
            display: 'flex',
            justifyContent: 'start',
            children: [
              icon &&
                /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(icon, {
                  fontSize: 'large',
                  className: classes.icon
                }),
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                variant: 'h4',
                className: classes.title,
                children: title
              })
            ]
          }),
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Box), {
            pl: 2,
            pr: 2,
            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
              variant: 'body1',
              children: text
            })
          }),
          children
        ]
      }),
      /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Notification), {})
    ]
  });
};
var $d6b5c702311394c4$export$2e2bcd8739ae039 = $d6b5c702311394c4$var$SimpleBox;

const $4c56dbfbda0fa20c$var$useStyles = (0, $parcel$interopDefault($4Uj5b$muistylesmakeStyles))(() => ({
  switch: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));
/**
 * @param {object} props Props
 * @param {boolean} props.hasSignup If to show signup form.
 * @param {boolean} props.allowUsername Indicates, if login is allowed with username (instead of email).
 * @param {string} props.postSignupRedirect Location to redirect to after signup.
 * @param {string} props.postLoginRedirect Location to redirect to after login.
 * @param {object} props.additionalSignupValues
 * @param {object} props.passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $4c56dbfbda0fa20c$var$LocalLoginPage = ({
  hasSignup: hasSignup,
  allowUsername: allowUsername,
  postSignupRedirect: postSignupRedirect,
  postLoginRedirect: postLoginRedirect,
  additionalSignupValues: additionalSignupValues,
  passwordScorer: passwordScorer = (0, $d1ca1e1d215e32ca$export$19dcdb21c6965fb8)
}) => {
  const classes = $4c56dbfbda0fa20c$var$useStyles();
  const navigate = (0, $4Uj5b$reactrouterdom.useNavigate)();
  const translate = (0, $4Uj5b$reactadmin.useTranslate)();
  const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
  const isSignup = hasSignup && searchParams.has('signup');
  const isResetPassword = searchParams.has('reset_password');
  const isNewPassword = searchParams.has('new_password');
  const isLogin = !isSignup && !isResetPassword && !isNewPassword;
  const loginCompleted = (0, $e5ab9cca64b9eee5$export$2e2bcd8739ae039)();
  const redirectTo = postLoginRedirect
    ? `${postLoginRedirect}?${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`
    : searchParams.get('redirect') || '/';
  const interactionId = searchParams.get('interaction_id');
  const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
  (0, $4Uj5b$react.useEffect)(() => {
    (async () => {
      if (!isLoading && identity?.id) {
        // If interactionId is set, it means we are connecting from another application
        // So call a custom endpoint to tell the OIDC server the login is completed
        if (interactionId) await loginCompleted(interactionId);
        window.location.href = redirectTo;
      }
    })();
  }, [identity, isLoading, navigate, searchParams, redirectTo, loginCompleted, interactionId]);
  const [title, text] = (0, $4Uj5b$react.useMemo)(() => {
    if (isSignup) return ['auth.action.signup', 'auth.helper.signup'];
    if (isLogin) return ['auth.action.login', 'auth.helper.login'];
    if (isResetPassword) return ['auth.action.reset_password', 'auth.helper.reset_password'];
    if (isNewPassword) return ['auth.action.set_new_password', 'auth.helper.set_new_password'];
  }, [isSignup, isLogin, isResetPassword, isNewPassword]);
  if (isLoading || identity?.id) return null;
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $d6b5c702311394c4$export$2e2bcd8739ae039), {
    title: translate(title),
    text: translate(text),
    icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $parcel$interopDefault($4Uj5b$muiiconsmaterialLock)), {}),
    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
      children: [
        isSignup &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $5f70c240e5b0340c$export$2e2bcd8739ae039), {
            delayBeforeRedirect: 4000,
            postSignupRedirect: postSignupRedirect,
            additionalSignupValues: additionalSignupValues,
            passwordScorer: passwordScorer
          }),
        isResetPassword &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $a04debd4e4af2a01$export$2e2bcd8739ae039), {}),
        isNewPassword &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $176df6bd8edc5f4d$export$2e2bcd8739ae039), {
            redirectTo: redirectTo,
            passwordScorer: passwordScorer
          }),
        isLogin &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $8a2df01c9f2675bb$export$2e2bcd8739ae039), {
            postLoginRedirect: postLoginRedirect,
            allowUsername: allowUsername
          }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)('div', {
          className: classes.switch,
          children: [
            (isSignup || isResetPassword) &&
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                to: `/login?${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                  variant: 'body2',
                  children: translate('auth.action.login')
                })
              }),
            isLogin &&
              /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                children: [
                  hasSignup &&
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)('div', {
                      children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                        to: `/login?signup=true&${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`,
                        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                          variant: 'body2',
                          children: translate('auth.action.signup')
                        })
                      })
                    }),
                  /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)('div', {
                    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                      to: `/login?reset_password=true&${(0, $cd7709c431b14d14$export$2e2bcd8739ae039)(searchParams)}`,
                      children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                        variant: 'body2',
                        children: translate('auth.action.reset_password')
                      })
                    })
                  })
                ]
              })
          ]
        })
      ]
    })
  });
};
$4c56dbfbda0fa20c$var$LocalLoginPage.defaultProps = {
  hasSignup: true,
  allowUsername: false,
  additionalSignupValues: {}
};
var $4c56dbfbda0fa20c$export$2e2bcd8739ae039 = $4c56dbfbda0fa20c$var$LocalLoginPage;

// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const $0973974d3aa8078b$var$ResourceWithPermission = ({ name: name, create: create, ...rest }) => {
  const createContainer = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainer)(name);
  const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)(createContainer);
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Resource), {
    ...rest,
    name: name,
    create:
      permissions && permissions.some(p => (0, $09c536abc6cea017$export$65615a101bd6f5ca).includes(p['acl:mode']))
        ? create
        : undefined
  });
};
var $0973974d3aa8078b$export$2e2bcd8739ae039 = $0973974d3aa8078b$var$ResourceWithPermission;

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const $9734e84907c0d5dd$var$UserMenuItem = /*#__PURE__*/ (0, $4Uj5b$react.forwardRef)(
  ({ label: label, icon: icon, to: to, ...rest }, ref) => {
    const { onClose: onClose } = (0, $4Uj5b$reactadmin.useUserMenu)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const navigate = (0, $4Uj5b$reactrouterdom.useNavigate)();
    const onClick = (0, $4Uj5b$react.useCallback)(() => {
      navigate(to);
      onClose();
    }, [to, onClose, navigate]);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.MenuItem), {
      onClick: onClick,
      ref: ref,
      ...rest,
      children: [
        icon &&
          /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemIcon), {
            children: /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(icon, {
              fontSize: 'small'
            })
          }),
        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
          children: translate(label)
        })
      ]
    });
  }
);
const $9734e84907c0d5dd$var$UserMenu = ({ logout: logout, profileResource: profileResource, ...otherProps }) => {
  const { data: identity } = (0, $4Uj5b$reactadmin.useGetIdentity)();
  return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.UserMenu), {
    ...otherProps,
    children:
      identity && identity.id !== ''
        ? [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              $9734e84907c0d5dd$var$UserMenuItem,
              {
                label: 'auth.action.view_my_profile',
                icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
                  (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialAccountCircle)),
                  {}
                ),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}/show`
              },
              'view'
            ),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              $9734e84907c0d5dd$var$UserMenuItem,
              {
                label: 'auth.action.edit_my_profile',
                icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
                  (0, $parcel$interopDefault($4Uj5b$muiiconsmaterialEdit)),
                  {}
                ),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`
              },
              'edit'
            ),
            /*#__PURE__*/ (0, $parcel$interopDefault($4Uj5b$react)).cloneElement(logout, {
              key: 'logout'
            })
          ]
        : [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              $9734e84907c0d5dd$var$UserMenuItem,
              {
                label: 'auth.action.signup',
                to: '/login?signup=true'
              },
              'signup'
            ),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(
              $9734e84907c0d5dd$var$UserMenuItem,
              {
                label: 'auth.action.login',
                to: '/login'
              },
              'login'
            )
          ]
  });
};
$9734e84907c0d5dd$var$UserMenu.defaultProps = {
  logout: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Logout), {}),
  profileResource: 'Person'
};
var $9734e84907c0d5dd$export$2e2bcd8739ae039 = $9734e84907c0d5dd$var$UserMenu;

const $84db3891236a263f$var$useCheckAuthenticated = message => {
  const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
  const notify = (0, $4Uj5b$reactadmin.useNotify)();
  const redirect = (0, $4Uj5b$reactadmin.useRedirect)();
  const location = (0, $4Uj5b$reactrouterdom.useLocation)();
  (0, $4Uj5b$react.useEffect)(() => {
    if (!isLoading && !identity?.id) {
      notify(message || 'ra.auth.auth_check_error', {
        type: 'error'
      });
      redirect(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [isLoading, identity, redirect, notify, location]);
  return {
    identity: identity,
    isLoading: isLoading
  };
};
var $84db3891236a263f$export$2e2bcd8739ae039 = $84db3891236a263f$var$useCheckAuthenticated;

const $80da6dcda9baa28b$var$emptyParams = {};
// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const $80da6dcda9baa28b$var$alreadyFetchedPermissions = {
  '{}': undefined
};
// Fork of usePermissionsOptimized, with a refetch option
const $80da6dcda9baa28b$var$usePermissionsWithRefetch = (params = $80da6dcda9baa28b$var$emptyParams) => {
  const key = JSON.stringify(params);
  const [state, setState] = (0, $4Uj5b$reactadmin.useSafeSetState)({
    permissions: $80da6dcda9baa28b$var$alreadyFetchedPermissions[key]
  });
  const getPermissions = (0, $4Uj5b$reactadmin.useGetPermissions)();
  const fetchPermissions = (0, $4Uj5b$react.useCallback)(
    () =>
      getPermissions(params)
        .then(permissions => {
          if (!(0, $parcel$interopDefault($4Uj5b$lodashisEqual))(permissions, state.permissions)) {
            $80da6dcda9baa28b$var$alreadyFetchedPermissions[key] = permissions;
            setState({
              permissions: permissions
            });
          }
        })
        .catch(error => {
          setState({
            error: error
          });
        }),
    [key, params, getPermissions]
  );
  (0, $4Uj5b$react.useEffect)(() => {
    fetchPermissions();
  }, [key]);
  return {
    ...state,
    refetch: fetchPermissions
  };
};
var $80da6dcda9baa28b$export$2e2bcd8739ae039 = $80da6dcda9baa28b$var$usePermissionsWithRefetch;

const $be2fdde9f3e3137d$var$englishMessages = {
  auth: {
    dialog: {
      container_permissions: 'Container permissions',
      resource_permissions: 'Resource permissions',
      login_required: 'Login required'
    },
    action: {
      submit: 'Submit',
      permissions: 'Permissions',
      signup: 'Signup',
      reset_password: 'Reset password',
      set_new_password: 'Set new password',
      logout: 'Logout',
      login: 'Login',
      view_my_profile: 'View my profile',
      edit_my_profile: 'Edit my profile'
    },
    right: {
      resource: {
        read: 'Read',
        append: 'Append',
        write: 'Write',
        control: 'Control'
      },
      container: {
        read: 'List',
        append: 'Add',
        write: 'Add',
        control: 'Control'
      }
    },
    agent: {
      anonymous: 'All users',
      authenticated: 'Connected users'
    },
    input: {
      agent_select: 'Add an user...',
      name: 'Surname',
      username: 'User ID',
      email: 'Email address',
      username_or_email: 'User ID or email address',
      current_password: 'Current password',
      new_password: 'New password',
      confirm_new_password: 'Confirm new password',
      password_strength: 'Password strength',
      password_too_weak: 'Password too weak. Increase length or add special characters.'
    },
    helper: {
      login: 'Sign in to your account',
      signup: 'Create your account',
      reset_password: 'Enter your email address below and we will send you a link to reset your password',
      set_new_password: 'Please enter your email address and a new password below'
    },
    message: {
      resource_show_forbidden: 'You are not allowed to view this resource',
      resource_edit_forbidden: 'You are not allowed to edit this resource',
      resource_delete_forbidden: 'You are not allowed to delete this resource',
      resource_control_forbidden: 'You are not allowed to control this resource',
      container_create_forbidden: 'You are not allowed to create new resource',
      container_list_forbidden: 'You are not allowed to list these resources',
      unable_to_fetch_user_data: 'Unable to fetch user data',
      no_token_returned: 'No token returned',
      invalid_token_returned: 'Invalid token returned',
      signup_error: 'Account registration failed',
      user_not_allowed_to_login: 'You are not allowed to login with this account',
      user_email_not_found: 'No account found with this email address',
      user_email_exist: 'An account already exist with this email address',
      username_exist: 'An account already exist with this user ID',
      username_invalid: 'This username is invalid. Only lowercase characters, numbers, dots and hyphens are authorized',
      new_user_created: 'Your account has been successfully created',
      user_connected: 'You are now connected',
      user_disconnected: 'You are now disconnected',
      bad_request: 'Bad request (Error message returned by the server: %{error})',
      account_settings_updated: 'Your account settings have been successfully updated',
      login_to_continue: 'Please login to continue',
      choose_pod_provider:
        'Please choose a POD provider in the list below. All application data will be saved on your POD.'
    },
    notification: {
      reset_password_submitted: 'An email has been sent with reset password instructions',
      reset_password_error: 'An error occurred',
      password_changed: 'Password changed successfully',
      new_password_error: 'An error occurred',
      invalid_password: 'Invalid password',
      get_settings_error: 'An error occurred',
      update_settings_error: 'An error occurred'
    }
  }
};
var $be2fdde9f3e3137d$export$2e2bcd8739ae039 = $be2fdde9f3e3137d$var$englishMessages;

const $6dbc362c3d93e01d$var$frenchMessages = {
  auth: {
    dialog: {
      container_permissions: 'Permissions sur le container',
      resource_permissions: 'Permissions sur la ressource',
      login_required: 'Connexion requise'
    },
    action: {
      submit: 'Soumettre',
      permissions: 'Permissions',
      signup: "S'inscrire",
      reset_password: 'Mot de passe oubli\xe9 ?',
      set_new_password: 'D\xe9finir le mot de passe',
      logout: 'Se d\xe9connecter',
      login: 'Se connecter',
      view_my_profile: 'Voir mon profil',
      edit_my_profile: '\xc9diter mon profil'
    },
    right: {
      resource: {
        read: 'Lire',
        append: 'Enrichir',
        write: 'Modifier',
        control: 'Administrer'
      },
      container: {
        read: 'Lister',
        append: 'Ajouter',
        write: 'Ajouter',
        control: 'Administrer'
      }
    },
    agent: {
      anonymous: 'Tous les utilisateurs',
      authenticated: 'Utilisateurs connect\xe9s'
    },
    input: {
      agent_select: 'Ajouter un utilisateur...',
      name: 'Pr\xe9nom',
      username: 'Identifiant unique',
      email: 'Adresse e-mail',
      username_or_email: 'Identifiant ou adresse e-mail',
      current_password: 'Mot de passe actuel',
      new_password: 'Nouveau mot de passe',
      confirm_new_password: 'Confirmer le nouveau mot de passe',
      password_strength: 'Force du mot de passe',
      password_too_weak: 'Mot de passe trop faible. Augmenter la longueur ou ajouter des caract\xe8res sp\xe9ciaux.'
    },
    helper: {
      login: 'Connectez-vous \xe0 votre compte.',
      signup: 'Cr\xe9ez votre compte',
      reset_password:
        'Entrez votre adresse mail ci-dessous et nous vous enverrons un lien pour r\xe9initialiser votre mot de passe',
      set_new_password: 'Veuillez entrer votre adresse mail et un nouveau mot de passe ci-dessous'
    },
    message: {
      resource_show_forbidden: "Vous n'avez pas la permission de voir cette ressource",
      resource_edit_forbidden: "Vous n'avez pas la permission d'\xe9diter cette ressource",
      resource_delete_forbidden: "Vous n'avez pas la permission d'effacer cette ressource",
      resource_control_forbidden: "Vous n'avez pas la permission d'administrer cette ressource",
      container_create_forbidden: "Vous n'avez pas la permission de cr\xe9er des ressources",
      container_list_forbidden: "Vous n'avez pas la permission de voir ces ressources",
      unable_to_fetch_user_data: 'Impossible de r\xe9cup\xe9rer les donn\xe9es du profil',
      no_token_returned: 'Aucun token a \xe9t\xe9 retourn\xe9',
      invalid_token_returned: 'Token invalide',
      signup_error: "L'inscription a \xe9chou\xe9",
      user_not_allowed_to_login: "Vous n'avez pas le droit de vous connecter avec ce compte",
      user_email_not_found: 'Aucun compte trouv\xe9 avec cette adresse mail',
      user_email_exist: 'Un compte existe d\xe9j\xe0 avec cette adresse mail',
      username_exist: 'Un compte existe d\xe9j\xe0 avec cet identifiant',
      username_invalid:
        "Cet identifiant n'est pas valide. Seuls les lettres minuscules, les chiffres, les points et les tirets sont autoris\xe9s",
      new_user_created: 'Votre compte a \xe9t\xe9 cr\xe9\xe9 avec succ\xe8s',
      user_connected: 'Vous \xeates maintenant connect\xe9',
      user_disconnected: 'Vous \xeates maintenant d\xe9connect\xe9',
      bad_request: "Requ\xeate erron\xe9e (Message d'erreur renvoy\xe9 par le serveur: %{error})",
      account_settings_updated: 'Les param\xe8tres de votre compte ont \xe9t\xe9 mis \xe0 jour avec succ\xe8s',
      login_to_continue: 'Veuillez vous connecter pour continuer',
      choose_pod_provider:
        "Veuillez choisir un fournisseur de PODs dans la liste ci-dessous. Toutes les donn\xe9es de l'application seront enregistr\xe9es sur votre POD."
    },
    notification: {
      reset_password_submitted:
        'Un e-mail a \xe9t\xe9 envoy\xe9 avec les instructions de r\xe9initialisation du mot de passe',
      reset_password_error: "Une erreur s'est produite",
      password_changed: 'Le mot de passe a \xe9t\xe9 chang\xe9 avec succ\xe8s',
      new_password_error: "Une erreur s'est produite",
      invalid_password: 'Mot de passe incorrect',
      get_settings_error: "Une erreur s'est produite",
      update_settings_error: "Une erreur s'est produite"
    }
  }
};
var $6dbc362c3d93e01d$export$2e2bcd8739ae039 = $6dbc362c3d93e01d$var$frenchMessages;

//# sourceMappingURL=index.cjs.js.map
