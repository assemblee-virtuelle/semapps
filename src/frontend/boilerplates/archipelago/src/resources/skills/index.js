import PairResourceCreate from '../PairResourceCreate';
import SkillEdit from './SkillEdit';
import SkillList from './SkillList';
import PanToolIcon from '@material-ui/icons/PanTool';

export default {
  list: SkillList,
  create: PairResourceCreate,
  edit: SkillEdit,
  icon: PanToolIcon,
  options: {
    label: 'Compétences'
  }
};
