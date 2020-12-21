import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { UsersInput } from '../../inputs';

export const SkillEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput label="Titre" source="pair:label" fullWidth />
      <UsersInput label="Proposés par" source="pair:offeredBy" />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
