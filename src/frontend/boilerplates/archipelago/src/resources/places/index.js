import PlaceCreate from './PlaceCreate';
import PlaceEdit from './PlaceEdit';
import PlaceList from './PlaceList';
import PlaceShow from './PlaceShow';
import PlaceIcon from '@material-ui/icons/Place';

export default {
  list: PlaceList,
  show: PlaceShow,
  create: PlaceCreate,
  edit: PlaceEdit,
  icon: PlaceIcon,
  options: {
    label: 'Lieux'
  }
};
