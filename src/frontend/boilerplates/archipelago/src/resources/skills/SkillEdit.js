import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';

export const SkillEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
