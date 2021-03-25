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
      <TextField source="pair:label" label="Nom" />
      <EditButton basePath="/Organization" />
    </Datagrid>
  </List>
);

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['pair:label'] || record['pair:preferedLabel']}"` : ''}</span>;
};

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <UriInput source="pair:aboutPage" label="Site web" fullWidth />
      <TextInput source="pair:address" label="Adresse" fullWidth />
      <JsonLdReferenceInput label="Responsables" reference="Person" source="pair:hasResponsible">
        <AutocompleteArrayInput
          optionText={record => `${record['foaf:givenName']} ${record['foaf:familyName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Membres" reference="Person" source="pair:affiliates">
        <AutocompleteArrayInput
          optionText={record => `${record['foaf:givenName']} ${record['foaf:familyName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Partenaires" reference="Agent" source="pair:partnerOf">
        <AutocompleteArrayInput
          optionText={record => (record && (record['pair:label'] || record['foaf:givenName'])) || 'LABEL MANQUANT'}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Intérêts" reference="Concept" source="pair:hasInterest">
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
      <TextInput source="pair:label" label="Nom" />
    </SimpleForm>
  </Create>
);
