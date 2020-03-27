import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  useAuthenticated,
  AutocompleteArrayInput,
  Show,
  TabbedShowLayout,
  Tab,
  ShowButton
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';
import { ActivitiesGrid, ActivitiesList, copyValues, JsonLdReferenceInput, DateTimeInput } from '../semapps';

export const ActionIcon = SettingsIcon;

export const ActionList = props => {
  useAuthenticated();
  return (
    <List title="Actions" {...props}>
      <Datagrid>
        <TextField source="pair:label" label="Nom" />
        <ShowButton basePath="/Project" />
        <EditButton basePath="/Project" />
      </Datagrid>
    </List>
  );
};

const ActionTitle = ({ record }) => {
  return <span>Action {record ? `"${record['pair:label']}"` : ''}</span>;
};

export const ActionEdit = props => (
  <Edit title={<ActionTitle />} {...props}>
    <SimpleForm
      decorators={[
        copyValues({ 'as:name': 'pair:label', 'as:content': 'pair:description', 'as:url': 'pair:homePage' })
      ]}
    >
      <TextInput source="as:name" label="Nom" fullWidth />
      <MarkdownInput multiline source="as:content" label="Description" fullWidth />
      <TextInput source="as:url" label="Site web" fullWidth />
      <TextInput source="as:image" label="Image" fullWidth />
      <JsonLdReferenceInput label="Tags" reference="Theme" source="as:tag">
        <AutocompleteArrayInput optionText={record => record['pair:preferedLabel']} fullWidth />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Auteurs" reference="Actor" source="as:attributedTo">
        <AutocompleteArrayInput optionText={record => record['as:name']} fullWidth />
      </JsonLdReferenceInput>
      <DateTimeInput source="as:published" label="Publié le" fullWidth />
      <DateTimeInput source="as:updated" label="Mis à jour le" fullWidth />
    </SimpleForm>
  </Edit>
);

export const ActionShow = props => (
  <Show title={<ActionTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Description">
        <TextField source="as:name" label="Nom" />
      </Tab>
      <Tab label="Activités émises">
        <ActivitiesList source="as:outbox">
          <ActivitiesGrid />
        </ActivitiesList>
      </Tab>
      <Tab label="Activités reçues">
        <ActivitiesList source="as:inbox">
          <ActivitiesGrid />
        </ActivitiesList>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
