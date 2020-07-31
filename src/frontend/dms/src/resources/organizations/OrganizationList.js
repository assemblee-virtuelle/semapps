import React from 'react';
import { Datagrid, EditButton, List, ShowButton, TextField } from 'react-admin';
import SearchFilter from '../../components/SearchFilter';

export const OrganizationList = props => (
  <List title="Organisations" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="label" label="Nom" />
      <ShowButton basePath="/Organization" />
      <EditButton basePath="/Organization" />
    </Datagrid>
  </List>
);

export default OrganizationList;
