import PairResourceCreate from '../PairResourceCreate';
import ProjectEdit from './ProjectEdit';
import ProjectList from './ProjectList';
import ProjectShow from './ProjectShow';
import SettingsIcon from '@material-ui/icons/Settings';

export default {
  list: ProjectList,
  show: ProjectShow,
  create: PairResourceCreate,
  edit: ProjectEdit,
  icon: SettingsIcon,
  options: {
    label: 'Projets'
  }
};
