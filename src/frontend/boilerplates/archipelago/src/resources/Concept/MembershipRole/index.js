import RoleCreate from './RoleCreate';
import RoleEdit from './RoleEdit';
import RoleList from './RoleList';
import FavoriteBorderIcon from '@material-ui/icons/Class';

export default {
  config: {
    list: RoleList,
    create: RoleCreate,
    edit: RoleEdit,
    icon: FavoriteBorderIcon,
    options: {
      label: 'Rôle de membre',
      parent: 'Concept'
    }
  },
  dataModel: {
    types: ['pair:MembershipRole'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'membership-roles',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Rôle de membre |||| Rôles de membre',
      fields: {
        'pair:label': 'Titre',
        'pair:comment': 'Courte description',
        'pair:description': 'Description',
        'pair:topicOf': 'Sujets'
      }
    }
  }
};
