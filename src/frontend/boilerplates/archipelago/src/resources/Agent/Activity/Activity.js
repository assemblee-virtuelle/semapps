import React from 'react';
import { Show } from 'react-admin';
import PanToolIcon from '@material-ui/icons/PanTool';
import { RedirectByType } from '@semapps/archipelago-layout';

const ActivityRedirect = props => (
  <Show {...props}>
    <RedirectByType typesMap={{ 
        Project: 'pair:Project',
        Event: 'pair:Event',
        Idea: 'pair:Idea',
        Task: 'pair:Task' 
    }} />
  </Show>
);

export default {
  config: {
    show: ActivityRedirect,
    icon: PanToolIcon,
    options: {
      label: 'Activités'
    }
  },
  dataModel: {
    types: [
        'pair:Project',
        'pair:Event',
        'pair:Idea',
        'pair:Task'
    ]
  },
  translations: {
    fr: {
      name: 'Activité |||| Activités'
    }
  }
};
