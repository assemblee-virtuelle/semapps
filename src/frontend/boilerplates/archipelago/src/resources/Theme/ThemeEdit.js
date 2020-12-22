import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { SubjectsInput } from '../../inputs';
import ThemeTitle from "./ThemeTitle";

export const ThemeEdit = props => (
  <Edit title={<ThemeTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <SubjectsInput source="pair:topicOf" />
    </SimpleForm>
  </Edit>
);

export default ThemeEdit;
