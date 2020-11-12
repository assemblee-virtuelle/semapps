import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { dataProvider, httpClient } from '@semapps/semantic-data-provider';
import { Layout, theme } from '@semapps/archipelago-layout';

import resources from './config/resources';
import ontologies from './config/ontologies';

import users from './resources/users';

function App() {
  return (
    <Admin
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies,
        jsonContext: process.env.REACT_APP_MIDDLEWARE_URL + 'context.json',
        uploadsContainerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'files'
      })}
      i18nProvider={polyglotI18nProvider(() => frenchMessages)}
      layout={Layout}
      theme={theme}
    >
      <Resource name="User" {...users} />
    </Admin>
  );
}

export default App;
