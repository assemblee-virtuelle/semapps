import PairResourceCreate from '../PairResourceCreate';
import OrganizationEdit from './OrganizationEdit';
import OrganizationList from './OrganizationList';
import OrganizationShow from './OrganizationShow';
import HomeIcon from '@material-ui/icons/Home';

export default {
  list: OrganizationList,
  show: OrganizationShow,
  create: PairResourceCreate,
  edit: OrganizationEdit,
  icon: HomeIcon,
  options: {
    label: 'Organisations'
  }
};
