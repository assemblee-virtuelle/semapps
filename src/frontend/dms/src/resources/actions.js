import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  DateTimeInput,
  useAuthenticated,
  AutocompleteArrayInput
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';
import { copyValues, JsonLdReferenceInput } from '../semapps';

export const ActionIcon = SettingsIcon;

export const ActionList = props => {
  useAuthenticated();
  return (
    <List title="Actions" {...props}>
      <Datagrid>
        <TextField source="pair:label" label="Nom" />
        <EditButton basePath="/pair-Project" />
      </Datagrid>
    </List>
  );
};

const ActionTitle = ({ record }) => {
  return <span>Action {record ? `"${record['pair:label']}"` : ''}</span>;
};

export const ActionEdit = props => (
  <Edit title={<ActionTitle />} {...props}>
    <SimpleForm
      decorators={[
        copyValues({ 'as:name': 'pair:label', 'as:content': 'pair:description', 'as:url': 'pair:homePage' })
      ]}
    >
      <TextInput source="as:name" label="Nom" fullWidth />
      <MarkdownInput multiline source="as:content" label="Description" fullWidth />
      <TextInput source="as:url" label="Site web" fullWidth />
      <TextInput source="as:image" label="Image" fullWidth />
      <JsonLdReferenceInput label="Tags" reference="pair-Thema" source="as:tag">
        <AutocompleteArrayInput optionText={record => record['pair:preferedLabel']} fullWidth />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Auteurs" reference="as-Person" source="as:attributedTo">
        <AutocompleteArrayInput optionText={record => record['as:name']} fullWidth />
      </JsonLdReferenceInput>
      <DateTimeInput source="as:published" label="Publié le" fullWidth />
      <DateTimeInput source="as:updated" label="Mis à jour le" fullWidth />
    </SimpleForm>
  </Edit>
);
