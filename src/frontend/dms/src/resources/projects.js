import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';
export const ProjectIcon = BookIcon;

export const ProjectList = (props) => (
  <List title="Projets" {...props}>
    <Datagrid>
      <TextField source="pair:label" label="Nom" />
      <EditButton basePath="/pair:Project" />
    </Datagrid>
  </List>
);

const ProjectTitle = ({ record }) => {
  return <span>Projet {record ? `"${record['pair:label']}"` : ''}</span>;
};

export const ProjectEdit = (props) => (
  <Edit title={<ProjectTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="@id" />
      <TextInput source="pair:label" label="Nom" />
      <TextInput multiline source="pair:description" label="Description" />
      <TextInput source="pair:webPage" label="Site web" />
    </SimpleForm>
  </Edit>
);

export const ProjectCreate = (props) => (
  <Create title="Create a Project" {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
      <TextInput multiline source="pair:description" label="Description" />
      <TextInput source="pair:webPage" label="Site web" />
    </SimpleForm>
  </Create>
);