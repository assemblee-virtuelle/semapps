import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const ThemeCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
    </SimpleForm>
  </Create>
);

export default ThemeCreate;
