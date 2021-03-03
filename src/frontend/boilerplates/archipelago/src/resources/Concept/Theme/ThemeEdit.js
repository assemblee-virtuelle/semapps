import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../pair';
import ThemeTitle from './ThemeTitle';

export const ThemeEdit = props => (
  <Edit title={<ThemeTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <AgentsInput source="pair:topicOf" />
    </SimpleForm>
  </Edit>
);

export default ThemeEdit;
