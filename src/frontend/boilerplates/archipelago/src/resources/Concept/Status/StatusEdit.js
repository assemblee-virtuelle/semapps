import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import StatusTitle from './StatusTitle';

export const ThemeEdit = props => (
  <EditWithPermissions title={<StatusTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
    </SimpleForm>
  </EditWithPermissions>
);

export default ThemeEdit;
