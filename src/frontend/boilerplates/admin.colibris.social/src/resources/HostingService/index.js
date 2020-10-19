import HostingServiceCreate from './HostingServiceCreate';
import HostingServiceEdit from './HostingServiceEdit';
import HostingServiceList from './HostingServiceList';
import HotelIcon from '@material-ui/icons/Hotel';

export default {
  list: HostingServiceList,
  create: HostingServiceCreate,
  edit: HostingServiceEdit,
  icon: HotelIcon,
  options: {
    label: "Offres d'hébergement"
  }
};
