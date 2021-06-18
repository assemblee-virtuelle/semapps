import jwtDecode from 'jwt-decode';
import { defaultToArray, getAclUri, getAclContext } from './utils';

const authProvider = ({ middlewareUri, allowAnonymous = true, checkUser = userData => true, httpClient, checkPermissions, resources }) => ({
  login: async params => {
    const url = new URL(window.location.href);
    window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURIComponent(url.origin + '/login?login=true')
  },
  logout: async () => {
    const url = new URL(window.location.href);
    if( !allowAnonymous ) {
      localStorage.removeItem('token');
      window.location.href =
        `${middlewareUri}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login')
    } else {
      // Redirect to login page after disconnecting from SSO
      // The login page will remove the token, display a notification and redirect to the homepage
      window.location.href =
        `${middlewareUri}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login?logout=true');

      // Avoid displaying immediately the login page
      return '/';
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if( !token && !allowAnonymous ) throw new Error();
  },
  checkUser,
  checkError: error => Promise.resolve(),
  getPermissions: async resourceId => {
    if (!checkPermissions) return true;

    // If a resource name is passed, get the corresponding container, otherwise assume we have the URI
    const resourceUri = resources[resourceId] ? resources[resourceId].containerUri : resourceId;

    const aclUri = getAclUri(middlewareUri, resourceUri);

    let { json } = await httpClient(aclUri);

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
  getIdentity: () => {
    const token = localStorage.getItem('token');
    if (token) {
      const { webId, name } = jwtDecode(token);
      return { id: webId, fullName: name };
    }
  }
});

export default authProvider;
