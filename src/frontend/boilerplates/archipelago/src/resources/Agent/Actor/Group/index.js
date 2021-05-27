import { PairResourceCreate } from '../../../../pair';
import GroupEdit from './GroupEdit';
import GroupList from './GroupList';
import GroupShow from './GroupShow';
import GroupIcon from '@material-ui/icons/Group';

export default {
  config: {
    list: GroupList,
    show: GroupShow,
    create: PairResourceCreate,
    edit: GroupEdit,
    icon: GroupIcon,
    options: {
      label: 'Groupes',
      parent: 'Actor'
    }
  },
  dataModel: {
    types: ['pair:Group'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'groups',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Groupe |||| Groupes',
      fields: {
        'pair:label': 'Nom',
        'pair:comment': 'Courte description',
        'pair:description': 'Description',
        image: 'Logo',
        'pair:affiliates': 'Membres',
        'pair:partnerOf': 'Partenaires',
        'pair:involvedIn': 'Participe à',
        'pair:hasTopic': 'Thèmes',
        'pair:documentedBy': 'Documents'
      }
    }
  }
};
