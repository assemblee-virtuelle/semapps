import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';
import { JsonLdSimpleForm, JsonLdReferenceInput } from '../utils/jsonLdInputs';

export const ProjectIcon = SettingsIcon;

export const ProjectList = (props) => (
  <List title="Projets" {...props}>
    <Datagrid>
      <TextField source="pair:preferedLabel" label="Nom" />
      <EditButton basePath="/Project" />
    </Datagrid>
  </List>
);

const ProjectTitle = ({ record }) => {
  return <span>Projet {record ? `"${record['pair:preferedLabel']}"` : ''}</span>;
};

export const ProjectEdit = (props) => (
  <Edit title={<ProjectTitle />} {...props}>
    <JsonLdSimpleForm>
      <TextInput source="pair:preferedLabel" label="Nom" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:webPage" label="Site web" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Organization" source="pair:isManagedBy" />
    </JsonLdSimpleForm>
  </Edit>
);

export const ProjectCreate = (props) => (
  <Create title="Créer un projet" {...props}>
    <SimpleForm>
      <TextInput source="pair:preferedLabel" label="Nom" />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:webPage" label="Site web" />
    </SimpleForm>
  </Create>
);