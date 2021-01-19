import PairResourceCreate from '../PairResourceCreate';
import SkillEdit from './SkillEdit';
import SkillList from './SkillList';
import SkillShow from './SkillShow';
import PanToolIcon from '@material-ui/icons/PanTool';

export default {
  config: {
    list: SkillList,
    create: PairResourceCreate,
    edit: SkillEdit,
    show: SkillShow,
    icon: PanToolIcon,
    options: {
      label: 'Compétences'
    }
  },
  dataModel: {
    types: ['pair:Skill'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'skills',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Compétence |||| Compétences',
      fields: {
        'pair:label': 'Titre',
        'pair:offeredBy': 'Proposé par'
      }
    }
  }
};
