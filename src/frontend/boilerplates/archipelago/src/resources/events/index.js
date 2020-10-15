import EventCreate from './EventCreate';
import EventEdit from './EventEdit';
import EventList from './EventList';
import EventShow from './EventShow';
import EventIcon from '@material-ui/icons/Event';

export default {
  list: EventList,
  show: EventShow,
  create: EventCreate,
  edit: EventEdit,
  icon: EventIcon,
  options: {
    label: 'Événements'
  }
};
