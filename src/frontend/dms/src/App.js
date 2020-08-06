import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
  dataProvider as createDataProvider,
  httpClient
} from '@semapps/react-admin';

import interests from './resources/interests';
import projects from './resources/projects';
import organizations from './resources/organizations';
import skills from './resources/skills';
import users from './resources/users';

import resources from './config/resources';
import ontologies from './config/ontologies';
import { Layout, theme } from './archipelago-layout';

const i18nProvider = polyglotI18nProvider(locale => frenchMessages);
const dataProvider = createDataProvider({
  sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
  httpClient,
  resources,
  ontologies,
  mainOntology: 'pair'
});

function App() {
  return (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider} layout={Layout} theme={theme}>
      <Resource name="Organization" {...organizations} />
      <Resource name="Project" {...projects} />
      <Resource name="User" {...users} />
      <Resource name="Skill" {...skills} />
      <Resource name="Interest" {...interests} />
    </Admin>
  );
}

export default App;
