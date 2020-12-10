import OrganizationTypeCreate from './OrganizationTypeCreate';
import OrganizationTypeEdit from './OrganizationTypeEdit';
import OrganizationTypeList from './OrganizationTypeList';
import OrganizationTypeShow from './OrganizationTypeShow';
import HomeWorkIcon from '@material-ui/icons/HomeWork';

export default {
  list: OrganizationTypeList,
  show: OrganizationTypeShow,
  create: OrganizationTypeCreate,
  edit: OrganizationTypeEdit,
  icon: HomeWorkIcon,
  options: {
    label: "Types d'orga."
  }
};
