import { PairResourceCreate } from '../../../../pair';
import TaskEdit from './TaskEdit';
import TaskList from './TaskList';
import TaskShow from './TaskShow';
import TaskIcon from '@material-ui/icons/PlaylistAddCheck';

export default {
  config: {
    list: TaskList,
    show: TaskShow,
    create: PairResourceCreate,
    edit: TaskEdit,
    icon: TaskIcon,
    options: {
      label: 'Tâches',
      parent: 'Activity'
    }
  },
  dataModel: {
    types: ['pair:Task'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'tasks',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Tâche |||| Tâches',
      fields: {
        'pair:label': 'Titre',
        'pair:description': 'Description',
        'pair:assignedTo': 'Est assigné à',
        'pair:partOf': 'Fait partie de',
        'pair:hasType': 'Type',
        'pair:hasStatus': 'Statut',
        'pair:dueDate': 'Date attendue',
        'pair:endDate': 'Date de fin effective',
        'pair:hasFollower': 'Suivie par',
        'pair:involves': 'Implique',
        'pair:inspiredBy': 'Inspiré par',
        'pair:hasTopic': 'A pour thème',
        'pair:needs': 'A besoin de',
        'pair:uses': 'Utilise'
      }
    }
  }
};
