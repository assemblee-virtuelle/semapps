import React from 'react';
import { AutocompleteArrayInput, SimpleForm, TextInput, DateTimeInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput } from '@semapps/semantic-data-provider';

const EventEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <DateTimeInput source="pair:startDate" label="Date de début" fullWidth />
      <DateTimeInput source="pair:endDate" label="Date de fin" fullWidth />
      <UriArrayInput label="Participe" reference="Organization" source="pair:involves">
        <AutocompleteArrayInput shouldRenderSuggestions={value => value.length > 1} optionText="pair:label" fullWidth />
      </UriArrayInput>
      <UriArrayInput label="Tags" reference="Theme" source="pair:hasTopic">
        <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => value.length > 1} fullWidth />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default EventEdit;
