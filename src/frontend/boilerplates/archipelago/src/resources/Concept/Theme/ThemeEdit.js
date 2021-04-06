import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { AgentsInput } from '../../../pair';
import ThemeTitle from './ThemeTitle';

export const ThemeEdit = props => (
  <EditWithPermissions title={<ThemeTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <AgentsInput source="pair:topicOf" />
    </SimpleForm>
  </EditWithPermissions>
);

export default ThemeEdit;
