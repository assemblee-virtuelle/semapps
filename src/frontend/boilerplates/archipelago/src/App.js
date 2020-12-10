import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { Layout } from '@semapps/archipelago-layout';
import { dataProvider, httpClient } from '@semapps/semantic-data-provider';

import resources from './config/resources';
import ontologies from './config/ontologies';
import theme from './config/theme';

import events from './resources/events';
import themes from './resources/themes';
import organizations from './resources/organizations';
import organizationTypes from './resources/organization-types';
import places from './resources/places';

const App = () => (
  <Admin
    dataProvider={dataProvider({
      sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
      httpClient,
      resources,
      ontologies,
      jsonContext: process.env.REACT_APP_MIDDLEWARE_URL + 'context.json',
      uploadsContainerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'files'
    })}
    i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
    layout={Layout}
    theme={theme}
  >
    <Resource name="Organization" {...organizations} />
    <Resource name="OrganizationType" {...organizationTypes} />
    <Resource name="Event" {...events} />
    <Resource name="Place" {...places} />
    <Resource name="Theme" {...themes} />
    <Resource name="Subject" />
  </Admin>
);

export default App;
