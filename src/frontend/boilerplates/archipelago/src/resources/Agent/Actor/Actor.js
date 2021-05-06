import PersonIcon from '@material-ui/icons/Person';

export default {
  config: {
    icon: PersonIcon,
    options: {
      label: 'Acteurs'
    }
  },
  dataModel: {
    types: ['pair:Organization', 'pair:Person','pair:Group']
  },
  translations: {
    fr: {
      name: 'Acteur |||| Acteurs'
    }
  }
};
