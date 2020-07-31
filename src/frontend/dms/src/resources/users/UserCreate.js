import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

const UserCreate = props => (
  <Create title="Créer un utilisateur" {...props}>
    <SimpleForm>
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom de famille" />
    </SimpleForm>
  </Create>
);

export default UserCreate;
