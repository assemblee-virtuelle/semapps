import { useEffect, useState } from 'react';
import CONFIG from '../config';
import useQuery from "../api/useQuery";

/**
 * useAuth React hook
 *
 * @param force - if true, the user will be redirected to connect
 * @return isLogged - true if user is logged
 * @return token - the JWT token of the user, or null
 * @return login - function to call if we want to force login
 */
const useAuth = ({ force } = { force: false }) => {
  const [token, setToken] = useState(null);
  const { data: user } = useQuery(`${CONFIG.MIDDLEWARE_URL}me`);

  const login = () => {
    window.location = `${CONFIG.MIDDLEWARE_URL}auth?redirectUrl=` + encodeURI(window.location.href);
  };

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
        login();
      }
    }
  }, [force]);

  return { isLogged: !!token, user, login };
};

export default useAuth;
