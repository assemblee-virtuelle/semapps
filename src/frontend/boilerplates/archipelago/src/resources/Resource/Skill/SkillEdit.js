import React from 'react';
import { FormTab, TextInput, TabbedForm } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { UsersInput, AgentsInput } from '../../../pair';
import SkillTitle from './SkillTitle';

export const SkillEdit = props => (
  <Edit title={<SkillTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
      </FormTab>
      <FormTab label="Relations">
        <UsersInput source="pair:offeredBy" />
        <AgentsInput source="pair:neededBy" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default SkillEdit;
