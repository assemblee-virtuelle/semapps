import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { SubjectsInput } from "../../inputs";

export const ThemeEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" fullWidth />
      <SubjectsInput label="Sujets" source="pair:topicOf" />
    </SimpleForm>
  </Edit>
);

export default ThemeEdit;
