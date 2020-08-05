import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

export const InterestEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
    </SimpleForm>
  </Edit>
);

export default InterestEdit;
