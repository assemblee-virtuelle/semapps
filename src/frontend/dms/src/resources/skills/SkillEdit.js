import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { EditActions } from "../../archipelago-layout";

export const SkillEdit = props => (
  <Edit actions={<EditActions />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
