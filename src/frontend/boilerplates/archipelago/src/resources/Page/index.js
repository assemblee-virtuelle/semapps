import PageCreate from './PageCreate';
import PageEdit from './PageEdit';
import PageList from './PageList';
import PageShow from './PageShow';
import DescriptionIcon from '@material-ui/icons/Description';

export default {
  config: {
    list: PageList,
    show: PageShow,
    create: PageCreate,
    edit: PageEdit,
    icon: DescriptionIcon,
    options: {
      label: 'Pages'
    }
  },
  dataModel: {
    types: ['semapps:Page'],
    fieldsMapping: {
      title: 'semapps:title'
    }
  },
  translations: {
    fr: {
      name: 'Page |||| Pages',
      fields: {
        'semapps:title': 'Titre',
        'semapps:content': 'Contenu'
      }
    }
  }
};
