import PairResourceCreate from '../PairResourceCreate';
import DocumentEdit from './DocumentEdit';
import DocumentList from './DocumentList';
import DocumentShow from './DocumentShow';
import DescriptionIcon from '@material-ui/icons/Description';

export default {
  config: {
    list: DocumentList,
    show: DocumentShow,
    create: PairResourceCreate,
    edit: DocumentEdit,
    icon: DescriptionIcon,
    options: {
      label: 'Documents'
    }
  },
  dataModel: {
    types: ['pair:Document'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'documents',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Document |||| Documents',
      fields: {
        'pair:label': 'Titre',
        'pair:description': 'Description',
        'pair:comment': 'Courte description',
        'pair:containedIn': 'Dossier',
        'pair:documents': 'Sujets'
      }
    }
  }
};
