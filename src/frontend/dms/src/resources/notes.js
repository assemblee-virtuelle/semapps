import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  useAuthenticated,
  AutocompleteArrayInput
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import Icon from '@material-ui/icons/InsertComment';
import { DateTimeInput, JsonLdReferenceInput, DateField } from '../semapps';

export const NoteIcon = Icon;

export const NoteList = props => {
  useAuthenticated();
  return (
    <List title="Actualités" {...props}>
      <Datagrid rowClick="edit">
        <DateField showTime source="published" label="Publié le" />
        <TextField source="name" label="Nom" />
        <EditButton basePath="/Note" />
      </Datagrid>
    </List>
  );
};

const NoteTitle = ({ record }) => {
  return <span>Actualite {record ? `"${record['as:name']}"` : ''}</span>;
};

export const NoteEdit = props => (
  <Edit title={<NoteTitle />} {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nom" fullWidth />
      <MarkdownInput multiline source="content" label="Description" fullWidth />
      <JsonLdReferenceInput label="Auteur" reference="Project" source="attributedTo">
        <AutocompleteArrayInput optionText={record => (record ? record['as:name'] : '')} fullWidth />
      </JsonLdReferenceInput>
      <DateTimeInput source="published" label="Publié le" fullWidth />
      <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
    </SimpleForm>
  </Edit>
);
