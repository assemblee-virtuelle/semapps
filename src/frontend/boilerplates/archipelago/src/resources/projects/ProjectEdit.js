import React from 'react';
import { AutocompleteArrayInput, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput } from '@semapps/semantic-data-provider';

const ProjectEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <UriArrayInput label="Géré par" reference="Organization" source="pair:managedBy">
        <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
      </UriArrayInput>
      <UriArrayInput label="Responsables" reference="User" source="pair:hasResponsible">
        <AutocompleteArrayInput
          optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
      <UriArrayInput label="Participants" reference="User" source="pair:involves">
        <AutocompleteArrayInput
          optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
