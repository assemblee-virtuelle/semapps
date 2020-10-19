import React from 'react';
import { TextField, Show, TabbedShowLayout, Tab } from 'react-admin';
import { ActivitiesList, ActivitiesGrid, CollectionList, ActorsGrid } from '@semapps/react-admin';

const ActorTitle = ({ record }) => {
  return <span>Acteur {record ? `"${record.preferredUsername}"` : ''}</span>;
};

const ActorShow = props => (
  <Show title={<ActorTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Profil">
        <TextField source="preferredUsername" label="Username" />
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

export default ActorShow;
