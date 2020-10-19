import React from 'react';
import { List, Datagrid, TextField, EditButton, DateField } from 'react-admin';
import SearchFilter from '../../components/SearchFilter';

const NoteList = props => (
  <List title="Actualités" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="edit">
      <DateField showTime source="published" label="Publié le" />
      <TextField source="name" label="Nom" />
      <EditButton basePath="/Note" />
    </Datagrid>
  </List>
);

export default NoteList;
