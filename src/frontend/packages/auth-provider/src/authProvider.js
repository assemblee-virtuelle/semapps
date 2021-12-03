import jwtDecode from 'jwt-decode';
import { defaultToArray, getAclUri, getAclContext } from './utils';

const authProvider = ({
  middlewareUri,
  allowAnonymous = true,
  localAccounts = false,
  checkUser,
  httpClient,
  checkPermissions,
  resources
}) => ({
  login: async params => {
    const url = new URL(window.location.href);
    if (localAccounts) {
      const { username, password } = params;
      try {
        const { json } = await httpClient(`${middlewareUri}auth/login`, {
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
      window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURIComponent(url.origin + '/login?login=true');
    }
  },
  signup: async params => {
    if (localAccounts) {
      const { username, email, password, ...profileData } = params;
      try {
        const { json } = await httpClient(`${middlewareUri}auth/signup`, {
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
        } else {
          throw new Error(e.message || 'ra.auth.sign_in_error');
        }
      }
    } else {
      window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURIComponent(url.origin + '/login?login=true');
    }
  },
  logout: async () => {
    localStorage.removeItem('token');
    if (localAccounts) {
      // Reload to ensure the dataServer config is reset
      window.location.reload();
      window.location.href = '/';
    } else {
      const url = new URL(window.location.href);
      if (!allowAnonymous) {
        window.location.href = `${middlewareUri}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login');
      } else {
        // Redirect to login page after disconnecting from SSO
        // The login page will remove the token, display a notification and redirect to the homepage
        window.location.href =
          `${middlewareUri}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login?logout=true');
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
  getPermissions: async resourceId => {
    if (!checkPermissions) return true;

    // If a resource name is passed, get the corresponding container, otherwise assume we have the URI
    const resourceUri = resources[resourceId] ? resources[resourceId].containerUri : resourceId;

    const aclUri = getAclUri(middlewareUri, resourceUri);

    const { json } = await httpClient(aclUri);

    return json['@graph'];
  },
  addPermission: async (resourceId, agentId, predicate, mode) => {
    // If a resource name is passed, get the corresponding container, otherwise assume we have the URI
    const resourceUri = resources[resourceId] ? resources[resourceId].containerUri : resourceId;

    const aclUri = getAclUri(middlewareUri, resourceUri);

    let authorization = {
      '@id': '#' + mode.replace('acl:', ''),
      '@type': 'acl:Authorization',
      [predicate]: agentId,
      'acl:accessTo': resourceUri,
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
  removePermission: async (resourceId, agentId, predicate, mode) => {
    // If a resource name is passed, get the corresponding container, otherwise assume we have the URI
    const resourceUri = resources[resourceId] ? resources[resourceId].containerUri : resourceId;
    const aclUri = getAclUri(middlewareUri, resourceUri);

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

      return { id: webId, fullName: profileData?.['pair:label'] || webIdData['foaf:name'], profileData, webIdData };
    }
  }
});

export default authProvider;
