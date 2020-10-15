import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserList from './UserList';
import UserShow from './UserShow';
import PersonIcon from '@material-ui/icons/Person';

export default {
  list: UserList,
  show: UserShow,
  create: UserCreate,
  edit: UserEdit,
  icon: PersonIcon,
  options: {
    label: 'Personnes'
  }
};
