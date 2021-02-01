import PersonIcon from '@material-ui/icons/Person';

export default {
  config: {
    icon: PersonIcon,
    options: {
      label: 'Objets'
    }
  },
  dataModel: {
    types: ['pair:Document', 'pair:Folder']
  },
  translations: {
    fr: {
      name: 'Objet |||| Objets'
    }
  }
};
