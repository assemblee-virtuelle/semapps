import React from 'react';
import { TabbedForm, TextInput, FormTab } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import StatusTitle from './StatusTitle';

export const ThemeEdit = props => (
  <Edit title={<StatusTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="données">
        <TextInput source="pair:label" fullWidth />
      </FormTab>
    </TabbedForm >
  </Edit>
);

export default ThemeEdit;
