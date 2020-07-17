import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  Show,
  Create,
  SimpleForm,
  TextField,
  EditButton,
  ShowButton,
  SingleFieldList,
  ChipField,
  TextInput,
  useAuthenticated,
  AutocompleteArrayInput,
  ReferenceArrayField
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import MarkDownField from '../components/MarkdownField';
import SettingsIcon from '@material-ui/icons/Settings';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';
import SearchFilter from '../components/SearchFilter';
import ColumnShowLayout from '../components/ColumnShowLayout';
import Column from '../components/Column';
import { makeStyles } from '@material-ui/core';
import Hero from "../components/Hero";

export const ProjectIcon = SettingsIcon;

export const ProjectList = props => {
  useAuthenticated();
  return (
    <List title="Projets" perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid rowClick="show">
        <TextField source="pairv1:preferedLabel" label="Nom" />
        <ShowButton basePath="/projects" />
        <EditButton basePath="/projects" />
      </Datagrid>
    </List>
  );
};

const ProjectTitle = ({ record }) => {
  return <span>{record ? record['pairv1:preferedLabel'] : ''}</span>;
};

export const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" fullWidth />
      <TextInput source="pairv1:comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:homePage" label="Site web" fullWidth />
      <UriInput source="pairv1:image" label="Image" fullWidth />
      <TextInput source="pairv1:adress" label="Adresse" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Agent" source="pairv1:isManagedBy">
        <AutocompleteArrayInput
          optionText={record => {
            // TODO improve the handling of the many possible cases
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

const JsonLdReferenceArrayField = ({ record, source, ...otherProps }) => {
  if (Array.isArray(record[source])) {
    record[source] = record[source].map(i => i['@id'] || i);
  }
  return <ReferenceArrayField record={record} source={source} {...otherProps} />;
};

const useStyles = makeStyles(() => ({
  card: {
    padding: 25
  },
  singleFieldList: {
    margin: 0
  }
}));

export const ProjectShow = props => {
  const classes = useStyles();
  return (
    <Show classes={{ card: classes.card }} {...props}>
      <ColumnShowLayout>
        <Column xs={9}>
          <Hero title={<ProjectTitle />}>
            <TextField label="Adresse" source="pairv1:adress" />
            <TextField label="Commentaire" source="pairv1:comment" />
            <TextField label="Adresse" source="pairv1:adress" />
          </Hero>
          <MarkDownField source="pairv1:description" addLabel />
        </Column>
        <Column xs={3} showLabel>
          <TextField label="Adresse" source="pairv1:adress" />
          <TextField label="Commentaire" source="pairv1:comment" />
          <JsonLdReferenceArrayField addLabel label="Les Partenaires" reference="Agent" source="pairv1:isManagedBy">
            <SingleFieldList classes={{ root: classes.singleFieldList }} linkType="show">
              <ChipField source="pairv1:preferedLabel" color="primary" />
            </SingleFieldList>
          </JsonLdReferenceArrayField>
        </Column>
      </ColumnShowLayout>
    </Show>
  );
};
