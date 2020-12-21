import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { AppBar } from '@semapps/archipelago-layout';
import { authProvider, LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';
import { dataProvider, httpClient } from '@semapps/semantic-data-provider';

import Layout from "./layout/Layout";
import theme from "./layout/theme";
import Home from "./pages/Home/Home";

import resources from './config/resources';
import ontologies from './config/ontologies';

import documents from './resources/documents';
import events from './resources/events';
import themes from './resources/themes';
import projects from './resources/projects';
import organizations from './resources/organizations';
import skills from './resources/skills';
import users from './resources/users';

const LayoutWithUserMenu = props => <Layout appBar={<AppBar userMenu={<UserMenu />} />} {...props} />;

const App = () => (
  <Admin
    authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
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
    loginPage={LoginPage}
    logoutButton={LogoutButton}
    dashboard={Home}
  >
    <Resource name="Organization" {...organizations} />
    <Resource name="Project" {...projects} />
    <Resource name="Event" {...events} />
    <Resource name="User" {...users} />
    <Resource name="Document" {...documents} />
    <Resource name="Skill" {...skills} />
    <Resource name="Theme" {...themes} />
    <Resource name="Folder" />
    <Resource name="Activity" />
    <Resource name="Actor" />
    <Resource name="Subject" />
  </Admin>
);

export default App;
