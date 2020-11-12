import React from 'react';
import { AutocompleteArrayInput, SimpleForm, TextInput, ImageInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput, ImageField } from '@semapps/semantic-data-provider';

export const OrganizationEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <ImageInput source="image" label="Logo" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UriArrayInput label="Membres" reference="User" source="pair:hasMember">
        <AutocompleteArrayInput
          optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
