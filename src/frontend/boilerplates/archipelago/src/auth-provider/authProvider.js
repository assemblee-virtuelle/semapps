const authProvider = middlewareUri => ({
  // TODO implement proper login screen
  login: params => Promise.resolve(),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = `${middlewareUri}auth/logout?global=true`;
  },
  checkAuth: () => {
    if (localStorage.getItem('token')) {
      return Promise.resolve();
    } else {
      // const url = new URL(window.location);
      // if (url.searchParams.has('token')) {
      //   localStorage.setItem('token', url.searchParams.get('token'));
      //   url.searchParams.delete('token');
      //   window.location.href = url.toString();
      // } else {
      //   window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURI(window.location.href);
      // }
      return Promise.resolve();
    }
  },
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve(),
  getIdentity: () => {
    console.log('getIdentity');
    return { id: 'sdcsd', fullName: 'Sébastien', avatar: '' };
  }
});

export default authProvider;
