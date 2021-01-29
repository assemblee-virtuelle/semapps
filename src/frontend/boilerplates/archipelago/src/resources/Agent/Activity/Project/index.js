import PairResourceCreate from '../../../PairResourceCreate';
import ProjectEdit from './ProjectEdit';
import ProjectList from './ProjectList';
import ProjectShow from './ProjectShow';
import SettingsIcon from '@material-ui/icons/Settings';

export default {
  config: {
    list: ProjectList,
    show: ProjectShow,
    create: PairResourceCreate,
    edit: ProjectEdit,
    icon: SettingsIcon,
    options: {
      label: 'Projets',
      parent: 'Activity'
    }
  },
  dataModel: {
    types: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'projects',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Projet |||| Projets',
      fields: {
        'pair:label': 'Nom',
        'pair:comment': 'Courte description',
        'pair:description': 'Description',
        'pair:homePage': 'Site web',
        'pair:involves': 'Participants',
        'pair:documentedBy': 'Documents',
        'pair:hasTopic': 'Thèmes'
      }
    }
  }
};
