import React from 'react';
import {
  List,
  Datagrid,
  Edit,
  TabbedForm,
  FormTab,
  TextField,
  EditButton,
  TextInput,
  useAuthenticated,
  AutocompleteArrayInput,
  Show,
  TabbedShowLayout,
  Tab,
  ShowButton,
  NumberInput
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

const decorators = [copyValues({ name: 'pair:label', content: 'pair:description', url: 'pair:homePage' })];

export const ActionEdit = props => (
  <Edit title={<ActionTitle />} {...props}>
    <TabbedForm decorators={decorators}>
      <FormTab label="Général">
        <TextInput source="name" label="Nom" fullWidth />
        <MarkdownInput multiline source="content" label="Description" fullWidth />
        <TextInput source="url" label="Site web" fullWidth />
        <TextInput source="image" label="Image" fullWidth />
        <DateTimeInput source="published" label="Publié le" fullWidth />
        <DateTimeInput source="updated" label="Mis à jour le" fullWidth />
      </FormTab>
      <FormTab label="Liens">
        <JsonLdReferenceInput label="Tags" reference="Theme" source="tag">
          <AutocompleteArrayInput optionText={record => record['pair:preferedLabel']} fullWidth />
        </JsonLdReferenceInput>
        <JsonLdReferenceInput label="Soutenu par" reference="Actor" source="pair:involves">
          <AutocompleteArrayInput optionText={record => record.name} fullWidth />
        </JsonLdReferenceInput>
      </FormTab>
      <FormTab label="Localisation">
        <TextInput source="location.name" label="Nom" fullWidth />
        <NumberInput source="location.latitude" label="Latitude" fullWidth />
        <NumberInput source="location.longitude" label="Longitude" fullWidth />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export const ActionShow = props => (
  <Show title={<ActionTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Description">
        <TextField source="name" label="Nom" />
      </Tab>
      <Tab label="Activités émises">
        <ActivitiesList source="outbox">
          <ActivitiesGrid />
        </ActivitiesList>
      </Tab>
      <Tab label="Activités reçues">
        <ActivitiesList source="inbox">
          <ActivitiesGrid />
        </ActivitiesList>
      </Tab>
      <Tab label="Abonnés">
        <CollectionList source="followers">
          <ActorsGrid />
        </CollectionList>
      </Tab>
      <Tab label="Abonnements">
        <CollectionList source="following">
          <ActorsGrid />
        </CollectionList>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
