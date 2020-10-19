import React from 'react';
import { List, Datagrid, TextField, EditButton, ShowButton } from 'react-admin';
import SearchFilter from '../../components/SearchFilter';

const ActionList = props => (
  <List title="Actions" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="pair:label" label="Nom" />
      <ShowButton basePath="/Action" />
      <EditButton basePath="/Action" />
    </Datagrid>
  </List>
);

export default ActionList;
