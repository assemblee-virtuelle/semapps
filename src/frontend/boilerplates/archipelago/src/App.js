import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { dataProvider, httpClient } from '@semapps/semantic-data-provider';
import { Layout, theme } from '@semapps/archipelago-layout';

import resources from './config/resources';
import ontologies from './config/ontologies';

import events from './resources/events';
import interests from './resources/interests';
import projects from './resources/projects';
import organizations from './resources/organizations';
import skills from './resources/skills';
import users from './resources/users';

function App() {
  return (
    <Admin
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies,
        jsonContext: window.location.origin + '/context.json',
      })}
      i18nProvider={polyglotI18nProvider(() => frenchMessages)}
      layout={Layout}
      theme={theme}
    >
      <Resource name="Organization" {...organizations} />
      <Resource name="Project" {...projects} />
      <Resource name="Event" {...events} />
      <Resource name="User" {...users} />
      <Resource name="Skill" {...skills} />
      <Resource name="Interest" {...interests} />
    </Admin>
  );
}

export default App;
