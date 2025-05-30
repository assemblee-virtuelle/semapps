import React from 'react';
import { List, Filter, Datagrid, Edit, Create, SimpleForm, TextField, TextInput } from 'react-admin';
import Icon from '@material-ui/icons/Description';

export const NoteIcon = Icon;

const SearchFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

export const NoteList = props => {
  return (
    <List title="Notes" perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid rowClick="edit">
        <TextField source="name" />
        <TextField source="content" />
      </Datagrid>
    </List>
  );
};

const NoteTitle = ({ record }) => {
  return <span>Note {record ? `"${record.name}"` : ''}</span>;
};

export const NoteEdit = props => (
  <Edit title={<NoteTitle />} {...props}>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="content" fullWidth multiline />
    </SimpleForm>
  </Edit>
);

export const NoteCreate = props => (
  <Create title="Create Note" {...props}>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="content" fullWidth multiline />
    </SimpleForm>
  </Create>
);
