import PanToolIcon from '@material-ui/icons/PanTool';

export default {
  config: {
    icon: PanToolIcon,
    options: {
      label: 'Activités'
    }
  },
  dataModel: {
    types: ['pair:Project', 'pair:Event']
  },
  translations: {
    fr: {
      name: 'Activité |||| Activités'
    }
  }
};
