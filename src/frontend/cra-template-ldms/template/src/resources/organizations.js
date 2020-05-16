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
import MarkdownInput from 'ra-input-markdown';
import GroupIcon from '@material-ui/icons/Group';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';
import SearchFilter from '../components/SearchFilter';

export const OrganizationIcon = GroupIcon;

export const OrganizationList = props => (
  <List title="Organisations" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="pairv1:preferedLabel" label="Nom" />
      <EditButton basePath="/Organization" />
    </Datagrid>
  </List>
);

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['pairv1:label'] || record['pairv1:preferedLabel']}"` : ''}</span>;
};

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
      <TextInput source="pairv1:comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:aboutPage" label="Site web" fullWidth />
      <TextInput source="pairv1:adress" label="Adresse" fullWidth />
      <TextInput source="pairv1:adressLine2" label="Adresse (suite)" fullWidth />
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
      <JsonLdReferenceInput label="Partenaires" reference="Agent" source="pairv1:isPartnerOf">
        <AutocompleteArrayInput
          optionText={record =>
            (record && (record['pairv1:preferedLabel'] || record['foaf:givenName'])) || 'LABEL MANQUANT'
          }
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Intérêts" reference="Concept" source="pairv1:hasInterest">
        <AutocompleteArrayInput
          optionText={record => (record && record['skos:prefLabel']['@value']) || 'LABEL MANQUANT'}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export const OrganizationCreate = props => (
  <Create title="Créer une organisation" {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
    </SimpleForm>
  </Create>
);
