import React from 'react';
import { Admin, Resource } from 'react-admin';
import ldpDataProvider from './ldpDataProvider';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';

function App() {
  return (
    <Admin dataProvider={ldpDataProvider('http://playground.semapps.org:3000/ldp/')}>
      <Resource name="pair:Project" list={ProjectList} edit={ProjectEdit} create={ProjectCreate} icon={ProjectIcon} options={{ label: 'Projets' }}/>
    </Admin>
  );
}

export default App;
