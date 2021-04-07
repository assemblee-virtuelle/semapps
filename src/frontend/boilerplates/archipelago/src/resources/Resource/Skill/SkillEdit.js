import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { UsersInput, AgentsInput } from '../../../pair';
import SkillTitle from './SkillTitle';

export const SkillEdit = props => (
  <EditWithPermissions title={<SkillTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <UsersInput source="pair:offeredBy" />
      <AgentsInput source="pair:neededBy" />
    </SimpleForm>
  </EditWithPermissions>
);

export default SkillEdit;
