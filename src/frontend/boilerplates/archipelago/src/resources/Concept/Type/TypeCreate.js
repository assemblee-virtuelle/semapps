import React from 'react';
import { SimpleForm, TextInput, SelectArrayInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const TypeCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <SelectArrayInput
        source="@type"
        choices={[
          { id: 'pair:Type', name: 'Type' },
          { id: 'pair:ActivityType', name: 'ActivityType' },
          { id: 'pair:AgentType', name: 'AgentType' },
          { id: 'pair:ConceptType', name: 'ConceptType' },
          { id: 'pair:DocumentType', name: 'DocumentType' },
          { id: 'pair:EventType', name: 'EventType' },
          { id: 'pair:FolderType', name: 'FolderType' },
          { id: 'pair:GroupType', name: 'GroupType' },
          { id: 'pair:IdeaType', name: 'IdeaType' },
          { id: 'pair:ObjectType', name: 'ObjectType' },
          { id: 'pair:OrganizationType', name: 'OrganizationType' },
          { id: 'pair:PlaceType', name: 'PlaceType' },
          { id: 'pair:ProjectType', name: 'ProjectType' },
          { id: 'pair:ResourceType', name: 'ResourceType' },
          { id: 'pair:SubjectType', name: 'SubjectType' },
          { id: 'pair:TaskType', name: 'TaskType' }
        ]}
      />
    </SimpleForm>
  </Create>
);

export default TypeCreate;
