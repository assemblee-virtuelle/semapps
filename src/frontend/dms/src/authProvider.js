const authProvider = {
  // TODO implement proper login screen
  login: params => Promise.resolve(),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = `http://localhost:3000/auth/logout?global=true`;
  },
  checkAuth: () => {
    if( localStorage.getItem('token') ) {
      return Promise.resolve();
    } else {
      const url = new URL(window.location);
      if (url.searchParams.has('token')) {
        localStorage.setItem('token', url.searchParams.get('token'));
        url.searchParams.delete('token');
        window.location = url.toString();
      } else {
        window.location = `http://localhost:3000/auth?redirectUrl=` + encodeURI(window.location.href)
      }
    }
  },
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve(),
};

export default authProvider;