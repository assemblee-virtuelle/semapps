import StatusCreate from './StatusCreate';
import TypeEdit from './StatusEdit';
import StatusList from './StatusList';
import VisibilityIcon from '@material-ui/icons/Visibility';

export default {
  config: {
    list: StatusList,
    create: StatusCreate,
    edit: TypeEdit,
    icon: VisibilityIcon,
    options: {
      label: 'Statuts',
      parent: 'Concept'
    }
  },
  dataModel: {
    types: ['pair:Status', 'pair:ActivityStatus', 'pair:AgentStatus', 'pair:DocumentStatus', 'pair:EventStatus', 'pair:IdeaStatus', 'pair:ProjectStatus', 'pair:TaskStatus'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'status',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Statut |||| Statuts',
      fields: {
        '@type': 'Classe',
        'pair:label': 'Nom'
      }
    }
  }
};
