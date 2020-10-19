import React from 'react';
import { TextField, Show, TabbedShowLayout, Tab, ImageField, UrlField, RichTextField } from 'react-admin';
import { ActivitiesList, ActivitiesGrid, CollectionList, ActorsGrid } from '@semapps/react-admin';
import ActionTitle from './ActionTitle';

const ActionShow = props => (
  <Show title={<ActionTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Description">
        <TextField source="name" label="Nom" />
        <UrlField source="pair:aboutPage.id" label="Description" />
        <ImageField source="image" label="Image" />
        <RichTextField source="pair:description" label="Description" />
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

export default ActionShow;
