import React from 'react';
import { Show } from 'react-admin';
import { RedirectByType } from '@semapps/archipelago-layout';

const AgentRedirect = props => (
  <Show {...props}>
    <RedirectByType
      typesMap={{
        Person: 'pair:Person',
        Organization: 'pair:Organization',
        Event: 'pair:Event',
        Project: 'pair:Project'
      }}
    />
  </Show>
);

export default {
  config: {
    show: AgentRedirect
  },
  dataModel: {
    types: ['pair:Project', 'pair:Organization', 'pair:Person', 'pair:Event']
  }
};
