import React from 'react';
import {
  Filter,
  List,
  Datagrid,
  Edit,
  Create,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  useAuthenticated,
  AutocompleteArrayInput
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';
import { JsonLdReferenceInput, UriInput } from '../semapps';
import SearchFilter from '../components/SearchFilter';

export const ProjectIcon = SettingsIcon;

export const ProjectList = props => {
  useAuthenticated();
  return (
    <List title="Projets" perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid rowClick="edit">
        <TextField source="pairv1:preferedLabel" label="Nom" />
        <EditButton basePath="/Project" />
      </Datagrid>
    </List>
  );
};

const ProjectTitle = ({ record }) => {
  return <span>Projet {record ? `"${record['pairv1:preferedLabel']}"` : ''}</span>;
};

export const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" fullWidth />
      <TextInput source="pairv1:comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:homePage" label="Site web" fullWidth />
      <TextInput source="pairv1:adress" label="Adresse" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Agent" source="pairv1:isManagedBy">
        <AutocompleteArrayInput
          optionText={record => {
            if (!record) return 'Label manquant';
            if (record['rdf:type'] === 'pairv1:Organization' || record['@type'] === 'pairv1:Organization') {
              if (Array.isArray(record['pairv1:preferedLabel'])) {
                return record['pairv1:preferedLabel'][0];
              } else {
                return record['pairv1:preferedLabel'] || 'Label manquant';
              }
            }
            return `${record['foaf:givenName']} ${record['foaf:familyName']}` || 'Label manquant';
          }}
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

export const ProjectCreate = props => (
  <Create title="Créer un projet" {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:homePage" label="Site web" />
    </SimpleForm>
  </Create>
);
