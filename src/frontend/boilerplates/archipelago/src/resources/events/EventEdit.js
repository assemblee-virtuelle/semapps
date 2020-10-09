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
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <TextInput source="pair:aboutPage" label="Réseaux sociaux" fullWidth />
      <DateTimeInput source="pair:startDate" label="Date de début" fullWidth />
      <DateTimeInput source="pair:endDate" label="Date de fin" fullWidth />
      <UriArrayInput label="Proposé par" reference="Organization" source="pair:deliveredBy">
        <AutocompleteArrayInput shouldRenderSuggestions={value => value.length > 1} optionText="pair:label" fullWidth />
      </UriArrayInput>
      <UriArrayInput label="Intérêts" reference="Interest" source="pair:hasInterest">
        <AutocompleteArrayInput shouldRenderSuggestions={value => value.length > 1} optionText="pair:label" fullWidth />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default EventEdit;
