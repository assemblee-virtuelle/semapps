import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CONFIG from '../config';
import useQuery from '../api/useQuery';
import { addFlash } from '../app/actions';

/**
 * useAuth React hook
 *
 * @param force - if true, the user will be redirected to connect
 * @return isLogged - true if user is logged
 * @return user - the user profile
 * @return webId - the webId of the user
 * @return login - function to call if we want to force login
 */
const useAuth = ({ force } = { force: false }) => {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  // We use the cacheOnly option to avoid the query to be made several times
  // The initial query is made once on the UserProvider component
  const { data: user, error } = useQuery(`${CONFIG.MIDDLEWARE_URL}me`, { cacheOnly: true });

  if (error && (error === '403' || error === '404')) {
    // Invalid token: remove it and redirect to homepage
    localStorage.removeItem('token');
    window.location = CONFIG.FRONTEND_URL;
  }

  const login = () => {
    window.location = `${CONFIG.MIDDLEWARE_URL}auth?redirectUrl=` + encodeURI(window.location.href);
  };

  useEffect(() => {
    const url = new URL(window.location);
    if (url.searchParams.has('token')) {
      setToken(url.searchParams.get('token'));
      localStorage.setItem('token', url.searchParams.get('token'));
      url.searchParams.delete('token');
      url.searchParams.append('action', 'created');
      window.location = url.toString();
    } else if (url.searchParams.get('action') === 'created') {
      dispatch(addFlash("Votre profil a bien été créé. Vous pouvez l'éditer ci-dessous."));
    } else {
      if (localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
      } else if (force) {
        login();
      }
    }
  }, [force, dispatch]);

  return { isLogged: !!token, user, webId: user ? user['@id'] : null, login };
};

export default useAuth;
