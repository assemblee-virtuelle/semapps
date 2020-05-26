import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider, httpClient } from '@semapps/react-admin';
import LogoutButton from './auth/LogoutButton';
import { PersonList, PersonIcon, PersonEdit, PersonCreate } from './resources/persons';
import resources from './config/resources';
import ontologies from './config/ontologies';

function App() {
  return (
    <Admin
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies
      })}
      logoutButton={LogoutButton}
    >
      <Resource
        name="Person"
        list={PersonList}
        edit={PersonEdit}
        create={PersonCreate}
        icon={PersonIcon}
        options={{ label: 'Personnes' }}
      />
    </Admin>
  );
}

export default App;
