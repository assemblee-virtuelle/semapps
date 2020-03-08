import React from 'react';
import { Admin, Resource } from 'react-admin';
import ldpDataProvider from './ldpDataProvider';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';

function App() {
  return (
    <Admin dataProvider={ldpDataProvider('http://localhost:3000/ldp/')}>
      <Resource name="Project" list={ProjectList} edit={ProjectEdit} create={ProjectCreate} icon={ProjectIcon} options={{ label: 'Projets' }}/>
      <Resource name="Organization" list={OrganizationList} edit={OrganizationEdit} create={OrganizationCreate} icon={OrganizationIcon} options={{ label: 'Organisations' }}/>
    </Admin>
  );
}

export default App;
