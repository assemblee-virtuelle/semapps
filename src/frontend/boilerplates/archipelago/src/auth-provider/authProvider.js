import jwtDecode from 'jwt-decode';

const authProvider = middlewareUri => ({
  login: params => {
    window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURI(window.location.href);
  },
  logout: () => {
    console.log('logout');
    // localStorage.removeItem('token');
    // window.location.href = `${middlewareUri}auth/logout`;
    return Promise.resolve();
  },
  checkAuth: () => {
    console.log('checkAuth');
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
      return jwtDecode(token);
    }
  }
});

export default authProvider;
