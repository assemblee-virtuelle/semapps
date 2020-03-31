import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider, authProvider, httpClient } from './semapps';
import LogoutButton from './auth/LogoutButton';
import { ActorList, ActorShow, ActorIcon } from './resources/actors';
import { ActivityList, ActivityIcon } from './resources/activities';
import { ActionList, ActionShow, ActionEdit, ActionIcon } from './resources/actions';
import { NoteList, NoteEdit, NoteIcon } from './resources/notes';
import { ThemeList, ThemeIcon } from './resources/themes';
// import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
// import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';
// import { PersonList, PersonIcon } from './resources/persons';
// import { ConceptList, ConceptIcon } from './resources/concepts';

const resourcesMap = {
  Actor: {
    classes: ['as:Person', 'as:Group', 'as:Organization']
  },
  Activity: {
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'activities'
  },
  Project: {
    classes: ['pair:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects/projects'
  },
  Note: {
    classes: ['as:Note'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects/notes'
  },
  Theme: {
    classes: ['pair:Thema'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects/themes'
  }
};

function App() {
  return (
    <Admin
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies
      })}
      authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
      logoutButton={LogoutButton}
    >
      <Resource
        name="Project"
        list={ProjectList}
        edit={ProjectEdit}
        create={ProjectCreate}
        icon={ProjectIcon}
        options={{ label: 'Projets' }}
      />
      <Resource
        name="Organization"
        list={OrganizationList}
        edit={OrganizationEdit}
        create={OrganizationCreate}
        icon={OrganizationIcon}
        options={{ label: 'Organisations' }}
      />
      <Resource name="Person" list={PersonList} icon={PersonIcon} options={{ label: 'Contributeurs' }} />
      <Resource name="Concept" list={ConceptList} icon={ConceptIcon} options={{ label: 'Concepts' }} />
      <Resource name="Agent" />
    </Admin>
  );
}

export default App;
