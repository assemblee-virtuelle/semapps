import React from 'react';
import { FormTab, TabbedForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import RoleTitle from './RoleTitle';

export const RoleEdit = props => (
  <Edit title={<RoleTitle />} {...props}>
    <TabbedForm redirect="show" >
      <FormTab label="données" >
        <TextInput source="pair:label" fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default RoleEdit;
