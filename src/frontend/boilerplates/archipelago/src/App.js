import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Layout, AppBar, theme } from '@semapps/archipelago-layout';
import { LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';
import { createBrowserHistory as createHistory } from 'history';

import HomePage from './HomePage';
import i18nProvider from './config/i18nProvider';
import authProvider from './config/authProvider';
import dataProvider from './config/dataProvider';
import * as resources from './resources';

const history = createHistory();
const AppBarWithUserMenu = props => <AppBar userMenu={<UserMenu />} {...props} />;
const LayoutWithUserMenu = props => <Layout {...props} appBar={AppBarWithUserMenu} />;

const App = () => (
  <Admin
    disableTelemetry
    history={history}
    title="META"
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    layout={LayoutWithUserMenu}
    theme={theme}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
    dashboard={HomePage}
  >
    {Object.entries(resources).map(([key, resource]) => (
      <Resource key={key} name={key} {...resource.config} />
    ))}
  </Admin>
);

export default App;
