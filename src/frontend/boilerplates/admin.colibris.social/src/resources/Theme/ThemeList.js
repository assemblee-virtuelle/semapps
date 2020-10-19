import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const ThemeList = props => (
  <List title="Thèmes" perPage={25} {...props}>
    <Datagrid>
      <TextField source="pair:preferedLabel" label="Nom" />
    </Datagrid>
  </List>
);

export default ThemeList;
