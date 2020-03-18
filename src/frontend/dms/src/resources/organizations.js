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
  AutocompleteArrayInput
} from 'react-admin';
import GroupIcon from '@material-ui/icons/Group';
import { JsonLdReferenceInput } from '../utils/jsonLdInputs';

export const OrganizationIcon = GroupIcon;

export const OrganizationList = (props) => (
  <List title="Organisations" {...props}>
    <Datagrid>
      <TextField source="pairv1:preferedLabel" label="Nom" />
      <EditButton basePath="/Organization" />
    </Datagrid>
  </List>
);

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['pairv1:label']}"` : ''}</span>;
};

export const OrganizationEdit = (props) => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
      <JsonLdReferenceInput label="Responsables" reference="Person" source="pairv1:hasResponsible">
        <AutocompleteArrayInput
          optionText={record => `${record['foaf:givenName']} ${record['foaf:familyName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Membres" reference="Person" source="pairv1:hasMember">
        <AutocompleteArrayInput
          optionText={record => `${record['foaf:givenName']} ${record['foaf:familyName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export const OrganizationCreate = (props) => (
  <Create title="Créer une organisation" {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
    </SimpleForm>
  </Create>
);