import SkillsCreate from './SkillCreate';
import SkillEdit from './SkillEdit';
import SkillList from './SkillList';
import PanToolIcon from '@material-ui/icons/PanTool';

export default {
  list: SkillList,
  create: SkillsCreate,
  edit: SkillEdit,
  icon: PanToolIcon,
  options: {
    label: 'Compétences'
  }
};
