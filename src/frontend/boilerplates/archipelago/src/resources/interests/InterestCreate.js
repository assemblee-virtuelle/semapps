import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const InterestCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" />
    </SimpleForm>
  </Create>
);

export default InterestCreate;
