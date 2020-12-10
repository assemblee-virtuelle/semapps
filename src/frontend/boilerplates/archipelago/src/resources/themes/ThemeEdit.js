import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';

export const ThemeEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
    </SimpleForm>
  </Edit>
);

export default ThemeEdit;
