import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  Create,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  useAuthenticated
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';

export const ActionIcon = SettingsIcon;

export const ActionList = (props) => {
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

export const ActionEdit = (props) => (
  <Edit title={<ActionTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <TextInput source="as:image" label="Image" fullWidth />
    </SimpleForm>
  </Edit>
);

export const ActionCreate = (props) => (
  <Create title="Créer un projet" {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" />
    </SimpleForm>
  </Create>
);