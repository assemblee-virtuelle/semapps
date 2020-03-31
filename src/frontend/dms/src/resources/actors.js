import React from 'react';
import { List, Datagrid, TextField, useAuthenticated, ShowButton, Show, TabbedShowLayout, Tab } from 'react-admin';
import Icon from '@material-ui/icons/Person';
import { ActivitiesList, ActivitiesGrid, CollectionList, ActorsGrid } from '../semapps';
import SearchFilter from "../components/SearchFilter";

export const ActorIcon = Icon;

const ActorTitle = ({ record }) => {
  return <span>Acteur {record ? `"${record['as:preferredUsername']}"` : ''}</span>;
};

export const ActorList = props => {
  useAuthenticated();
  return (
    <List title="Acteurs" perPage={25} filters={<SearchFilter/>} {...props}>
      <Datagrid rowClick="show">
        <TextField source="as:name" label="Nom" />
        <TextField source="as:preferredUsername" label="Username" />
        <ShowButton basePath="/Actor" />
      </Datagrid>
    </List>
  );
};

export const ActorShow = props => (
  <Show title={<ActorTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Profil">
        <TextField source="as:preferredUsername" label="Username" />
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
