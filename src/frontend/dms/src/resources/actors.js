import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  useAuthenticated,
  ShowButton,
  Show,
  TabbedShowLayout,
  Tab
} from 'react-admin';
import Icon from '@material-ui/icons/Person';

export const ActorIcon = Icon;

const ActorTitle = ({ record }) => {
  return <span>Acteur {record ? `"${record['as:preferredUsername']}"` : ''}</span>;
};

export const ActorList = props => {
  useAuthenticated();
  return (
    <List title="Acteurs" {...props}>
      <Datagrid>
        <TextField source="as:preferredUsername" label="Username" />
        <TextField source="as:name" label="Nom" />
        <ShowButton basePath="/as-Person" />
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
    </TabbedShowLayout>
  </Show>
);
