
const authProvider = (history, middlewareUri) => ({

  login: params => Promise.resolve(),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = `${middlewareUri}auth/logout?global=true`;
    return Promise.resolve('/loggingout');
  },
  checkAuth: () => {

    const url = new URL(window.location);
    if (localStorage.getItem('token')) {
      return Promise.resolve();
    } else {
      if (url.searchParams.has('token')) {
        localStorage.setItem('token', url.searchParams.get('token'));
        url.searchParams.delete('token');
        //TODO: if other searchParams remain, we should add them here
        history.push(url.pathname);
        return Promise.resolve();
      } else {
        if (window.location.pathname != '/loggingout')
          window.location.href = `${middlewareUri}auth?redirectUrl=` + encodeURIComponent(window.location.href);
        
        return Promise.resolve()
      }
    }
  },
  checkError: error => Promise.resolve(),
  getPermissions: params => {
    if (localStorage.getItem('token')) {
      return Promise.resolve('user');
    }
    else return Promise.resolve('');
  }
});

export default authProvider;
