import PairResourceCreate from '../PairResourceCreate';
import OrganizationEdit from './OrganizationEdit';
import OrganizationList from './OrganizationList';
import OrganizationShow from './OrganizationShow';
import HomeIcon from '@material-ui/icons/Home';

export default {
  config: {
    list: OrganizationList,
    show: OrganizationShow,
    create: PairResourceCreate,
    edit: OrganizationEdit,
    icon: HomeIcon,
    options: {
      label: 'Organisations'
    }
  },
  dataModel: {
    Organization: {
      types: ['pair:Organization'],
      containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'organizations',
      slugField: 'pair:label'
    }
  },
  translations: {
    fr: {
      Organization: {
        name: 'Organisation |||| Organisations',
        fields: {
          'pair:label': 'Nom',
          'pair:description': 'Description',
          'pair:comment': 'Courte description',
          'pair:homePage': 'Site web',
          'image': 'Logo',
          'pair:affiliates': 'Membres',
          'pair:partnerOf': 'Partenaires',
          'pair:involvedIn': 'Participe à',
          'pair:hasTopic': 'Thèmes',
          'pair:documentedBy': 'Documents'
        },
      }
    }
  }

};
