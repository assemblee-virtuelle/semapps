import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="foaf:name" label="Prénom" fullWidth />
      <TextInput source="foaf:familyName" label="Nom de famille" fullWidth />
    </SimpleForm>
  </Create>
);

export default UserCreate;
