import React from 'react';
import { AutocompleteArrayInput, SimpleForm, TextInput, ReferenceInput, AutocompleteInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput } from '@semapps/semantic-data-provider';

const OrganizationsArrayInput = ({ label, source }) => (
  <UriArrayInput label={label} reference="Organization" source={source}>
    <AutocompleteArrayInput
      optionText="pair:label"
      shouldRenderSuggestions={value => value.length > 1}
      fullWidth
    />
  </UriArrayInput>
);

export const OrganizationEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <OrganizationsArrayInput label="Filiales" source="pair:hasPart" />
      <OrganizationsArrayInput label="Filiale de" source="pair:partOf" />
      <OrganizationsArrayInput label="Partenaires" source="pair:partnerOf" />
      <OrganizationsArrayInput label="Connait" source="pair:follows" />
      <OrganizationsArrayInput label="Connu par" source="pair:hasFollower" />
      <UriArrayInput label="Participe à" reference="Event" source="pair:involvedIn">
        <AutocompleteArrayInput
          optionText="pair:label"
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
      <UriArrayInput label="Tags" reference="Theme" source="pair:hasTopic">
        <AutocompleteArrayInput
          optionText="pair:label"
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
