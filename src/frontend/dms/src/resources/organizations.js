import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput } from 'react-admin';
import GroupIcon from '@material-ui/icons/Group';
import { JsonLdSimpleForm, JsonLdReferenceInput } from '../utils/jsonLdInputs';

export const OrganizationIcon = GroupIcon;

export const OrganizationList = (props) => (
  <List title="Organisations" {...props}>
    <Datagrid>
      <TextField source="pair:preferedLabel" label="Nom" />
      <EditButton basePath="/Organization" />
    </Datagrid>
  </List>
);

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['pair:label']}"` : ''}</span>;
};

export const OrganizationEdit = (props) => (
  <Edit title={<OrganizationTitle />} {...props}>
    <JsonLdSimpleForm>
      <TextInput disabled source="@id" />
      <TextInput source="pair:preferedLabel" label="Nom" />
      <JsonLdReferenceInput label="Responsables" reference="Person" source="pair:hasResponsible" />
      <JsonLdReferenceInput label="Membres" reference="Person" source="pair:hasMember" />
    </JsonLdSimpleForm>
  </Edit>
);

export const OrganizationCreate = (props) => (
  <Create title="Créer une organisation" {...props}>
    <SimpleForm>
      <TextInput source="pair:preferedLabel" label="Nom" />
    </SimpleForm>
  </Create>
);