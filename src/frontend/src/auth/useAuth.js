import { useEffect, useState } from 'react';
import CONFIG from '../config';

const useAuth = ({ force } = { force: false }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const url = new URL(window.location);
    if (url.searchParams.has('token')) {
      setToken(url.searchParams.get('token'));
      localStorage.setItem('token', url.searchParams.get('token'));
      url.searchParams.delete('token');
      window.location = url.toString();
    } else {
      if (localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
      } else if (force) {
        window.location = `${CONFIG.MIDDLEWARE_URL}auth?redirectUrl=` + encodeURI(CONFIG.FRONTEND_URL + 'users');
      }
    }
  }, []);

  return !!token;
};

export default useAuth;
