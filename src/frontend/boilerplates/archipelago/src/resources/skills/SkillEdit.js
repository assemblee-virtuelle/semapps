import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { UsersInput } from '../../inputs';

export const SkillEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <UsersInput source="pair:offeredBy" />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
