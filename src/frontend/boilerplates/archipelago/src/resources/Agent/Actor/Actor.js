import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { Show } from 'react-admin';
import { RedirectByType } from '@semapps/archipelago-layout';

const ActorRedirect = props => (
  <Show {...props}>
    <RedirectByType typesMap={{ Person: 'pair:Person', Organization: 'pair:Organization' }} />
  </Show>
);

export default {
  config: {
    show: ActorRedirect,
    icon: PersonIcon,
    options: {
      label: 'Acteurs'
    }
  },
  dataModel: {
    types: ['pair:Organization', 'pair:Person', 'pair:Group']
  },
  translations: {
    fr: {
      name: 'Acteur |||| Acteurs'
    }
  }
};
