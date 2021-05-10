import React from 'react';
import { SimpleForm, TextInput, SelectArrayInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const StatusCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <SelectArrayInput
        source="@type"
        choices={[
          { id: 'pair:Status', name: 'Status' },
          { id: 'pair:ActivityStatus', name: 'ActivityStatus' },
          { id: 'pair:AgentStatus', name: 'AgentStatus' },
          { id: 'pair:DocumentStatus', name: 'DocumentStatus' },
          { id: 'pair:EventStatus', name: 'EventStatus' },
          { id: 'pair:IdeaStatus', name: 'IdeaStatus' },
          { id: 'pair:ProjectStatus', name: 'ProjectStatus' },
          { id: 'pair:TaskStatus', name: 'TaskStatus' }
        ]}
      />
    </SimpleForm>
  </Create>
);

export default StatusCreate;
