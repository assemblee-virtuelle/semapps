import React from 'react';
import { Admin, Resource } from 'react-admin';
import ldpDataProvider from './ldpDataProvider';
import authProvider from "./authProvider";
import httpClient from "./httpClient";
import LogoutButton from "./auth/LogoutButton";
import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';
import { PersonList, PersonIcon } from './resources/persons';

function App() {
  return (
    <Admin
      dataProvider={ldpDataProvider('http://localhost:3000/ldp/', 'pair', httpClient)}
      authProvider={authProvider('http://localhost:3000')}
      logoutButton={LogoutButton}
    >
      <Resource name="Project" list={ProjectList} edit={ProjectEdit} create={ProjectCreate} icon={ProjectIcon} options={{ label: 'Projets' }}/>
      {/*<Resource name="Organization" list={OrganizationList} edit={OrganizationEdit} create={OrganizationCreate} icon={OrganizationIcon} options={{ label: 'Organisations' }}/>*/}
      {/*<Resource name="Person" list={PersonList} icon={PersonIcon} options={{ label: 'Contributeurs' }}/>*/}
    </Admin>
  );
}

export default App;
