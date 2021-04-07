import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import RoleTitle from './RoleTitle';

export const RoleEdit = props => (
  <EditWithPermissions title={<RoleTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
    </SimpleForm>
  </EditWithPermissions>
);

export default RoleEdit;
