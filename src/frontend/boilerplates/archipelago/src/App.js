import React from 'react';
import { Admin, Resource } from 'react-admin';

import { Layout, AppBar, theme } from '@semapps/archipelago-layout';
import { authProvider, LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';

import i18nProvider from "./config/i18nProvider";
import dataProvider from "./config/dataProvider";

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
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    layout={LayoutWithUserMenu}
    theme={theme}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
  >
    <Resource name="Organization" {...organizations.config} />
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
