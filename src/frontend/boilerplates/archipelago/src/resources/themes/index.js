import ThemeCreate from './ThemeCreate';
import ThemeEdit from './ThemeEdit';
import ThemeList from './ThemeList';
import ThemeShow from './ThemeShow';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

export default {
  list: ThemeList,
  show: ThemeShow,
  create: ThemeCreate,
  edit: ThemeEdit,
  icon: LocalOfferIcon,
  options: {
    label: 'Thèmes'
  }
};
