import React from 'react';
import { AutocompleteArrayInput, SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { UriArrayInput } from '@semapps/semantic-data-provider';

export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="foaf:name" label="Prénom" fullWidth />
      <TextInput source="foaf:familyName" label="Nom de famille" fullWidth />
      <UriArrayInput label="Connait" reference="User" source="foaf:knows">
        <AutocompleteArrayInput
          optionText={record => record && `${record['foaf:name']} ${record['foaf:familyName']}`}
          shouldRenderSuggestions={value => value.length > 1}
          fullWidth
        />
      </UriArrayInput>
    </SimpleForm>
  </Edit>
);

export default UserEdit;
