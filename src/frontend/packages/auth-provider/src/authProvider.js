import jwtDecode from 'jwt-decode';
import urlJoin from 'url-join';

const authProvider = ({ middlewareUri, httpClient, checkPermissions, resources }) => ({
  login: params => {
    window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURIComponent(window.location.href);
    return Promise.resolve();
  },
  logout: () => {
    // Redirect to login page after disconnecting from SSO
    // The login page will remove the token, display a notification and redirect to the homepage
    const url = new URL(window.location.href);
    window.location.href =
      `${middlewareUri}auth/logout?redirectUrl=` + encodeURIComponent(url.origin + '/login?logout');

    // Avoid displaying immediately the login page
    return Promise.resolve('/');
  },
  checkAuth: () => {
    if (localStorage.getItem('token')) {
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  },
  checkError: error => Promise.resolve(),
  getPermissions: async ({ resourceId }) => {
    if( !checkPermissions ) return true;

    // If no ID is provided, we assume we need to check the container URI
    const resourceUri = /*id || */ resources[resourceId].containerUri;

    const aclUri = urlJoin(middlewareUri, resourceUri.replace(middlewareUri, '_acl/'));

    let { json } = await httpClient(aclUri);

    return json['@graph'].map(permission => permission['acl:mode']);
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
