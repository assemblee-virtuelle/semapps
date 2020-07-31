import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
  dataProvider as createDataProvider,
  authProvider as createAuthProvider,
  httpClient
} from '@semapps/react-admin';

import { ProjectList, ProjectShow, ProjectCreate, ProjectEdit } from './resources/projects';
import { OrganizationList, OrganizationShow, OrganizationCreate, OrganizationEdit } from './resources/organizations';
import resources from './config/resources';
import ontologies from './config/ontologies';
import Layout from './components/Layout';

const i18nProvider = polyglotI18nProvider(locale => frenchMessages);
const dataProvider = createDataProvider({
  sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
  httpClient,
  resources,
  ontologies,
  mainOntology: 'pair'
});
const authProvider = createAuthProvider(process.env.REACT_APP_MIDDLEWARE_URL);

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      layout={Layout}
    >
      <Resource name="Project" list={ProjectList} show={ProjectShow} edit={ProjectEdit} create={ProjectCreate} />
      <Resource name="Organization" list={OrganizationList} show={OrganizationShow} edit={OrganizationEdit} create={OrganizationCreate} />
      <Resource name="Person" />
      <Resource name="Concept" />
    </Admin>
  );
}

export default App;
