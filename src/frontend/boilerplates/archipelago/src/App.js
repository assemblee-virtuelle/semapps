import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { dataProvider, httpClient } from '@semapps/semantic-data-provider';
import { Layout, AppBar, theme } from '@semapps/archipelago-layout';
import LoginPage from './auth-provider/LoginPage';
import LogoutButton from './auth-provider/LogoutButton';
import authProvider from './auth-provider/authProvider';
import UserMenu from './auth-provider/UserMenu';

import resources from './config/resources';
import ontologies from './config/ontologies';

import events from './resources/events';
import interests from './resources/interests';
import projects from './resources/projects';
import organizations from './resources/organizations';
import skills from './resources/skills';
import users from './resources/users';

const LayoutWithUserMenu = props => (
  <Layout appBar={<AppBar userMenu={<UserMenu />}/>} {...props} />
);

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
    layout={LayoutWithUserMenu}
    theme={theme}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
  >
    <Resource name="Organization" {...organizations} />
    <Resource name="Project" {...projects} />
    <Resource name="Event" {...events} />
    <Resource name="User" {...users} />
    <Resource name="Skill" {...skills} />
    <Resource name="Interest" {...interests} />
  </Admin>
);

export default App;
