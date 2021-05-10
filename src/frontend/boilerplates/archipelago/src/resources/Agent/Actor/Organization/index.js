import { PairResourceCreate } from '../../../../pair';
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
      label: 'Organisations',
      parent: 'Actor'
    }
  },
  dataModel: {
    types: ['pair:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'organizations',
    dereference: ['pair:hasLocation/pair:hasPostalAddress', 'pair:organizationOfMembership'],
    slugField: 'pair:label',
    forceArray: ['pair:organizationOfMembership']
  },
  translations: {
    fr: {
      name: 'Organisation |||| Organisations',
      fields: {
        'pair:label': 'Nom',
        'pair:comment': 'Courte description',
        'pair:description': 'Description',
        'pair:homePage': 'Site web',
        image: 'Logo',
        'pair:affiliates': 'A pour membres',
        'pair:partnerOf': 'Partenaire de',
        'pair:involvedIn': 'Impliqué dans',
        'pair:hasType': 'Type',
        'pair:hasStatus': 'Statut',
        'pair:hasTopic': 'A pour thème',
        'pair:documentedBy': 'Documenté par',
        'pair:hasLocation': 'Adresse',
        'pair:organizationOfMembership': 'Membres avec Role',
        'pair:membershipActor': 'Membre',
        'pair:membershipRole': 'Role'
      }
    }
  }
};
