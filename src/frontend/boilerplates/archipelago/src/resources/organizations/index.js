import OrganizationCreate from './OrganizationCreate';
import OrganizationEdit from './OrganizationEdit';
import OrganizationList from './OrganizationList';
import OrganizationShow from './OrganizationShow';
import AccountBalanceIcon from '@material-ui/icons/Home';

export default {
  list: OrganizationList,
  show: OrganizationShow,
  create: OrganizationCreate,
  edit: OrganizationEdit,
  icon: AccountBalanceIcon,
  options: {
    label: 'Organisations'
  }
};
