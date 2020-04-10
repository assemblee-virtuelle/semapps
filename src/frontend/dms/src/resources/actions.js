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
  ShowButton,
  NumberInput,
  Labeled
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  ActivitiesList,
  ActivitiesGrid,
  CollectionList,
  ActorsGrid,
  copyValues,
  JsonLdReferenceInput,
  DateTimeInput
} from '../semapps';

export const ActionIcon = SettingsIcon;

export const ActionList = props => {
  useAuthenticated();
  return (
    <List title="Actions" {...props}>
      <Datagrid rowClick="show">
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
    <SimpleForm decorators={[copyValues({ name: 'pair:label', content: 'pair:description', url: 'pair:homePage' })]}>
      <TextInput source="name" label="Nom" fullWidth />
      <MarkdownInput multiline source="content" label="Description" fullWidth />
      <TextInput source="url" label="Site web" fullWidth />
      <TextInput source="image" label="Image" fullWidth />
      <JsonLdReferenceInput label="Tags" reference="Theme" source="tag">
        <AutocompleteArrayInput optionText={record => record['pair:preferedLabel']} fullWidth />
      </JsonLdReferenceInput>
      {/*<JsonLdReferenceInput label="Auteurs" reference="Actor" source="attributedTo">*/}
      {/*  <AutocompleteArrayInput optionText={record => record.name} fullWidth />*/}
      {/*</JsonLdReferenceInput>*/}
      <Labeled label="Location">
        <span>
          <NumberInput source="location.latitude" />
          &nbsp;
          <NumberInput source="location.longitude" />
        </span>
      </Labeled>
      <DateTimeInput source="published" label="Publié le" fullWidth />
      <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
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
      <Tab label="Abonnés">
        <CollectionList source="as:followers">
          <ActorsGrid />
        </CollectionList>
      </Tab>
      <Tab label="Abonnements">
        <CollectionList source="as:following">
          <ActorsGrid />
        </CollectionList>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
