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
  SimpleShowLayout,
  ChipField,
  RichTextField,
  TextInput,
  FunctionField,
  useAuthenticated,
  AutocompleteArrayInput,
  ReferenceArrayField
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import MarkDownField from '../components/MarkdownField';
import { Grid, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';
import SearchFilter from '../components/SearchFilter';

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
  return <span>Projet {record ? `"${record['pairv1:preferedLabel']}"` : ''}</span>;
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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}));

const ColumnShowLayout = props => {
  const {
    basePath,
    children,
    record,
    resource
  } = props;

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {React.Children.map(children, column =>
          column && React.isValidElement(column) ?
            React.cloneElement(column, {
              resource,
              record,
              basePath,
            }) : null
        )}
      </Grid>
    </div>
  );
};

const Column = props => {
  const {
    basePath,
    children,
    record,
    resource,
    xs
  } = props;

  return (
    <Grid item xs={xs}>
      {React.Children.map(children, field =>
        field && React.isValidElement(field) ?
          React.cloneElement(field, {
            resource,
            record,
            basePath,
          }) : null
      )}
    </Grid>
  );
};

const JsonLdReferenceArrayField = ({ record, source, ...otherProps }) => {
  if( Array.isArray(record[source]) ) {
    record[source] =  record[source].map(i => i['@id'] || i);
  }
  return(
    <ReferenceArrayField record={record} source={source} {...otherProps} />
  );
}

export const ProjectShow = props => {
  return (
    <Show {...props}>
      <ColumnShowLayout>
        <Column xs={9}>
          <FunctionField render={record => <h1>{record['pairv1:preferedLabel']}</h1>} />
          <MarkDownField source="pairv1:description" addLabel label="Adresse" />
        </Column>
        <Column xs={3}>
          <TextField source="pairv1:adress" />
          <JsonLdReferenceArrayField label="Géré par" reference="Agent" source="pairv1:isManagedBy">
            <SingleFieldList>
              <ChipField source="pairv1:preferedLabel" />
            </SingleFieldList>
          </JsonLdReferenceArrayField>
        </Column>
      </ColumnShowLayout>
    </Show>
  );
};
