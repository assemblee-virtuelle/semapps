import { PairResourceCreate } from '../../../../pair';
import IdeaEdit from './IdeaEdit';
import IdeaList from './IdeaList';
import IdeaShow from './IdeaShow';
import IdeaIcon from '@material-ui/icons/EmojiObjects';

export default {
  config: {
    list: IdeaList,
    show: IdeaShow,
    create: PairResourceCreate,
    edit: IdeaEdit,
    icon: IdeaIcon,
    options: {
      label: 'Idées',
      parent: 'Activity'
    }
  },
  dataModel: {
    types: ['pair:Idea'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ideas',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Idée |||| Idées',
      fields: {
        'pair:label': 'Titre',
        'pair:description': 'Description',
//       about -> [Subject]
        'pair:brainstormedBy': 'Imaginée par' /*Actor*/,
        'pair:concretizedBy' : 'Concrétisée par' /*Activity*/,
        'pair:hasType': 'Type',
        'pair:hasStatus': 'Statut'
      }
    }
  }
};
