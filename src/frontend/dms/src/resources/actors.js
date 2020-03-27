import React from 'react';
import { List, Datagrid, TextField, useAuthenticated, ShowButton, Show, TabbedShowLayout, Tab } from 'react-admin';
import Icon from '@material-ui/icons/Person';
import { ActivitiesList } from '../semapps';
import ActivitiesGrid from '../components/ActivitiesGrid';

export const ActorIcon = Icon;

const ActorTitle = ({ record }) => {
  return <span>Acteur {record ? `"${record['as:preferredUsername']}"` : ''}</span>;
};

export const ActorList = props => {
  useAuthenticated();
  return (
    <List title="Acteurs" {...props}>
      <Datagrid rowClick="show">
        <TextField source="as:preferredUsername" label="Username" />
        <TextField source="as:name" label="Nom" />
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
    </TabbedShowLayout>
  </Show>
);
