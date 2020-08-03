import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
  dataProvider as createDataProvider,
  authProvider as createAuthProvider,
  httpClient
} from '@semapps/react-admin';

import projects from './resources/projects';
import organizations from './resources/organizations';
import users from './resources/users';
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
      <Resource name="Project" {...projects} />
      <Resource name="Organization" {...organizations} />
      <Resource name="User" {...users} />
    </Admin>
  );
}

export default App;
