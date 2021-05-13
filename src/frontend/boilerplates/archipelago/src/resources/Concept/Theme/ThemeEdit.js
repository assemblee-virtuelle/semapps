import React from 'react';
import { FormTab, TabbedForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { AgentsInput } from '../../../pair';
import ThemeTitle from './ThemeTitle';

export const ThemeEdit = props => (
  <EditWithPermissions title={<ThemeTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
      </FormTab>
      <FormTab label="Relations">
        <AgentsInput source="pair:topicOf" />
      </FormTab>
    </TabbedForm>
  </EditWithPermissions>
);

export default ThemeEdit;
