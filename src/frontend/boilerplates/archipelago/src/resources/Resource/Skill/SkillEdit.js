import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { UsersInput } from '../../../pair';
import SkillTitle from './SkillTitle';

export const SkillEdit = props => (
  <Edit title={<SkillTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <UsersInput source="pair:offeredBy" />
    </SimpleForm>
  </Edit>
);

export default SkillEdit;
