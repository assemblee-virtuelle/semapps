import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { UsersInput, AgentsInput } from '../../../pair';
import SkillTitle from './SkillTitle';

export const SkillEdit = props => (
  <Edit title={<SkillTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <UsersInput source="pair:offeredBy" />
      <AgentsInput source="pair:neededBy" />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
