import jwtDecode from 'jwt-decode';

const authProvider = middlewareUri => ({
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
  getPermissions: params => Promise.resolve(),
  getIdentity: () => {
    const token = localStorage.getItem('token');
    if (token) {
      const { webId, name, familyName } = jwtDecode(token);
      return { id: webId, fullName: `${name} ${familyName}` };
    }
  }
});

export default authProvider;
