import React from 'react';
import { Datagrid, EditButton, List, ShowButton, TextField } from 'react-admin';
import SearchFilter from '../../components/SearchFilter';

export const UserList = props => (
  <List title="Utilisateurs" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="firstName" label="Prénom" />
      <TextField source="lastName" label="Nom de famille" />
      <ShowButton basePath="/User" />
      <EditButton basePath="/User" />
    </Datagrid>
  </List>
);

export default UserList;
