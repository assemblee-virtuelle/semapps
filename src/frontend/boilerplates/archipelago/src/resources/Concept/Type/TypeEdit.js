import React from 'react';
import { TabbedForm, FormTab, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import TypeTitle from './TypeTitle';

export const ThemeEdit = props => (
  <Edit title={<TypeTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ThemeEdit;
