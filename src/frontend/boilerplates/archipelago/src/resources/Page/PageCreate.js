import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Create } from '@semapps/archipelago-layout';

const PageCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="semapps:title" fullWidth />
    </SimpleForm>
  </Create>
);

export default PageCreate;
