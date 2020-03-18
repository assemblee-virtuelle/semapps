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
import { JsonLdSimpleForm, JsonLdReferenceInput } from '../utils/jsonLdInputs';

export const ProjectIcon = SettingsIcon;

export const ProjectList = (props) => {
  useAuthenticated();
  return (
    <List title="Projets" {...props}>
      <Datagrid>
        <TextField source="pair:label" label="Nom" />
        <EditButton basePath="/Project" />
      </Datagrid>
    </List>
  );
};

const ProjectTitle = ({ record }) => {
  return <span>Projet {record ? `"${record['pair:label']}"` : ''}</span>;
};

export const ProjectEdit = (props) => (
  <Edit title={<ProjectTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <TextInput source="as:image" label="Image" fullWidth />
    </SimpleForm>
  </Edit>
);

export const ProjectCreate = (props) => (
  <Create title="Créer un projet" {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" />
    </SimpleForm>
  </Create>
);