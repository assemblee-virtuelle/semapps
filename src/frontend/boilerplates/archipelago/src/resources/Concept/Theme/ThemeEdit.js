import React from 'react';
import { FormTab, TabbedForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { AgentsInput } from '../../../pair';
import ThemeTitle from './ThemeTitle';

export const ThemeEdit = props => (
  <Edit title={<ThemeTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
        <AgentsInput source="pair:topicOf" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ThemeEdit;
