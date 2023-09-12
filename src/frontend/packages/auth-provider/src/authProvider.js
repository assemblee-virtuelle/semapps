import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';
import { defaultToArray, getAclUri, getAclContext, getAuthServerUrl } from './utils';

const AUTH_TYPE_SSO = 'sso';
const AUTH_TYPE_LOCAL = 'local';
const AUTH_TYPE_POD = 'pod';

const authProvider = ({
  dataProvider,
  authType,
  allowAnonymous = true,
  checkUser,
  checkPermissions = false
}) => {
  if (![AUTH_TYPE_SSO, AUTH_TYPE_LOCAL, AUTH_TYPE_POD].includes(authType))
    throw new Error('The authType parameter is missing from the auth provider');
  return ({
    login: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      if (authType === AUTH_TYPE_LOCAL) {
        const { username, password } = params;
        try {
          const { json } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/login'), {
            method: 'POST',
            body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            headers: new Headers({ 'Content-Type': 'application/json' })
          });
          const { token } = json;
          localStorage.setItem('token', token);
          // Reload to ensure the dataServer config is reset
          window.location.reload();
        } catch (e) {
          throw new Error('ra.auth.sign_in_error');
        }
      } else {
        let redirectUrl = `${new URL(window.location.href).origin  }/login?login=true`;
        if (params.redirect) redirectUrl += `&redirect=${  encodeURIComponent(params.redirect)}`;
        window.location.href = urlJoin(authServerUrl, `auth?redirectUrl=${  encodeURIComponent(redirectUrl)}`);
      }
    },
    signup: async params => {
      const authServerUrl = await getAuthServerUrl(dataProvider);
      if (authType === AUTH_TYPE_LOCAL) {
        const { username, email, password, domain, ...profileData } = params;
        try {
          const { json } = await dataProvider.fetch(urlJoin(authServerUrl, 'auth/signup'), {
            method: 'POST',
            body: JSON.stringify({
              username: username.trim(),
              email: email.trim(),
              password: password.trim(),
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
        const redirectUrl = `${new URL(window.location.href).origin  }/login?login=true`;
        window.location.href = urlJoin(authServerUrl, `auth?redirectUrl=${  encodeURIComponent(redirectUrl)}`);
      }
    },
    logout: async () => {
      switch(authType) {
        case AUTH_TYPE_LOCAL:
          // Delete token but also any other value in local storage
          localStorage.clear();
          // Reload to ensure the dataServer config is reset
          window.location.reload();
          window.location.href = '/';
          break;

        case AUTH_TYPE_SSO:
          const authServerUrl = await getAuthServerUrl(dataProvider);
          const baseUrl = new URL(window.location.href).origin;
          window.location.href = urlJoin(
            authServerUrl,
            `auth/logout?redirectUrl=${  encodeURIComponent(`${urlJoin(baseUrl, 'login')  }?logout=true`)}`
          );
          break;

        case AUTH_TYPE_POD:
          const token = localStorage.getItem('token');
          const { webId } = jwtDecode(token);
          // Delete token but also any other value in local storage
          localStorage.clear();
          window.location.href = `${urlJoin(webId, 'openApp')  }?type=${  encodeURIComponent('http://activitypods.org/ns/core#FrontAppRegistration')}`;
          break;
      }

      // Avoid displaying immediately the login page
      return '/';
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

      if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to getPermissions must be an URL');

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
      if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to addPermission must be an URL');

      const aclUri = getAclUri(uri);

      const authorization = {
        '@id': `#${  mode.replace('acl:', '')}`,
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
        const { webId } = jwtDecode(token);

        const { json: webIdData } = await dataProvider.fetch(webId);
        const { json: profileData } = webIdData.url ? await dataProvider.fetch(webIdData.url) : {};

        return {
          id: webId,
          fullName: profileData?.['vcard:given-name'] || profileData?.['pair:label'] || webIdData['foaf:name'] || webIdData['pair:label'],
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
          body: JSON.stringify({ currentPassword, email: email.trim(), newPassword }),
          headers: new Headers({ 'Content-Type': 'application/json' })
        });
      } catch (e) {
        if (e.message === 'auth.account.invalid_password') {
          throw new Error('auth.notification.invalid_password');
        }

        throw new Error('auth.notification.update_settings_error');
      }
    }
  });
}

export default authProvider;
