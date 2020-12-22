import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserList from './UserList';
import UserShow from './UserShow';
import PersonIcon from '@material-ui/icons/Person';

export default {
  config: {
    list: UserList,
    show: UserShow,
    create: UserCreate,
    edit: UserEdit,
    icon: PersonIcon,
    options: {
      label: 'Personnes'
    }
  },
  dataModel: {
    types: ['pair:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'users',
    slugField: ['pair:firstName', 'pair:lastName']
  },
  translations: {
    fr: {
      name: 'Personne |||| Personnes',
      fields: {
        'pair:firstName': 'Prénom',
        'pair:lastName': 'Nom de famille',
        image: 'Photo',
        'pair:involvedIn': 'Participe à',
        'pair:affiliatedBy': 'Organisations',
        'pair:offers': 'Compétences',
        'pair:hasTopic': 'Intérêts'
      }
    }
  }
};
