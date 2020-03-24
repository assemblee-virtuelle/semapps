import useQuery from '../api/useQuery';
import CONFIG from '../config';

const UserProvider = ({ children }) => {
  useQuery(`${CONFIG.MIDDLEWARE_URL}me`);
  return children;
};

export default UserProvider;
