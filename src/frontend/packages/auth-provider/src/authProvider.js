import jwtDecode from 'jwt-decode';
import { defaultToArray, getAclUri, getAclContext } from './utils';

const authProvider = ({
  middlewareUri,
  allowAnonymous = true,
  localAccounts = false,
  checkUser,
  httpClient,
  checkPermissions
}) => ({
  login: async params => {
    const url = new URL(window.location.href);
    const serverUrl = middlewareUri || (params.domain && `https://${params.domain}/`);
    if (!serverUrl)
      throw new Error(
        'You must specify a middlewareUri in the authProvider config, or specify a domain when calling the login method'
      );
    if (localAccounts) {
      const { username, password } = params;
      try {
        const { json } = await httpClient(`${serverUrl}auth/login`, {
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
      window.location.href = `${serverUrl}auth?redirectUrl=` + encodeURIComponent(url.origin + '/login?login=true');
    }
  },
  signup: async params => {
    const serverUrl = middlewareUri || (params.domain && `https://${params.domain}/`);
    if (!serverUrl)
      throw new Error(
        'You must specify a middlewareUri in the authProvider config, or specify a domain when calling the signup method'
      );
    if (localAccounts) {
      const { username, email, password, domain, ...profileData } = params;
      try {
        const { json } = await httpClient(`${serverUrl || `https://${domain}`}auth/signup`, {
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
      window.location.href = `${serverUrl}auth?redirectUrl=` + encodeURIComponent(url.origin + '/login?login=true');
    }
  },
  logout: async () => {
    let serverUrl;
    if (middlewareUri) {
      serverUrl = middlewareUri;
    } else {
      // Get the server URL from the connected user's webId
      const token = localStorage.getItem('token');
      if (token) {
        const { webId } = jwtDecode(token);
        serverUrl = new URL(webId).origin + '/';
      }
    }

    localStorage.removeItem('token');
    if (localAccounts) {
      // Reload to ensure the dataServer config is reset
      window.location.reload();
      window.location.href = '/';
    } else if (serverUrl) {
      const url = new URL(window.location.href);
      if (!allowAnonymous) {
        window.location.href = `${serverUrl}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login');
      } else {
        // Redirect to login page after disconnecting from SSO
        // The login page will remove the token, display a notification and redirect to the homepage
        window.location.href =
          `${serverUrl}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login?logout=true');
      }
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
    } else {
      return true;
    }
  },
  checkError: error => Promise.resolve(),
  getPermissions: async uri => {
    if (!checkPermissions) return true;

    if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to getPermissions must be an URL');

    const aclUri = getAclUri(uri);

    const { json } = await httpClient(aclUri);

    return json['@graph'];
  },
  addPermission: async (uri, agentId, predicate, mode) => {
    const aclUri = getAclUri(uri);

    if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to addPermission must be an URL');

    let authorization = {
      '@id': '#' + mode.replace('acl:', ''),
      '@type': 'acl:Authorization',
      [predicate]: agentId,
      'acl:accessTo': uri,
      'acl:mode': mode
    };

    await httpClient(aclUri, {
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
    let { json } = await httpClient(aclUri);

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

    await httpClient(aclUri, {
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

      const { json: webIdData } = await httpClient(webId);
      const { json: profileData } = webIdData.url ? await httpClient(webIdData.url) : {};

      return {
        id: webId,
        fullName: profileData?.['vcard:given-name'] || profileData?.['pair:label'] || webIdData['foaf:name'],
        profileData,
        webIdData
      };
    }
  },
  resetPassword: async params => {
    const serverUrl = middlewareUri || (params.domain && `https://${params.domain}/`);
    if (!serverUrl)
      throw new Error(
        'You must specify a middlewareUri in the authProvider config, or specify a domain when calling the forgot password method'
      );
    const { email } = params;
    try {
      await httpClient(`${serverUrl}auth/reset_password`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      });
    } catch (e) {
      throw new Error('auth.message.reset_password_error');
    }
  },
  setNewPassword: async params => {
    const serverUrl = middlewareUri || (params.domain && `https://${params.domain}/`);
    if (!serverUrl)
      throw new Error(
        'You must specify a middlewareUri in the authProvider config, or specify a domain when calling the new password method'
      );
    const { email, token, password } = params;
    try {
      await httpClient(`${serverUrl}auth/new_password`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), token, password }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      });
    } catch (e) {
      throw new Error('auth.message.new_password_error');
    }
  },
});

export default authProvider;
