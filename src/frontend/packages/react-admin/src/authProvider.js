const authProvider = middlewareUri => ({

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
        window.location.href = url.toString();
        return Promise.reject({ redirectTo: '/no-access' });
      } else {
        console.log(window.location.pathname)
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
