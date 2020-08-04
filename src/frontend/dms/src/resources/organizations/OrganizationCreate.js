import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

const OrganizationCreate = props => (
  <Create title="Créer une organisation" {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
    </SimpleForm>
  </Create>
);

export default OrganizationCreate;
