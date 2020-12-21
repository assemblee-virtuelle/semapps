import PairResourceCreate from '../PairResourceCreate';
import DocumentEdit from './DocumentEdit';
import DocumentList from './DocumentList';
import DocumentShow from './DocumentShow';
import DescriptionIcon from '@material-ui/icons/Description';

export default {
  list: DocumentList,
  show: DocumentShow,
  create: PairResourceCreate,
  edit: DocumentEdit,
  icon: DescriptionIcon,
  options: {
    label: 'Documents'
  }
};
