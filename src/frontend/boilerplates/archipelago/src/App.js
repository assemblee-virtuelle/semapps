import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Layout, AppBar, theme } from '@semapps/archipelago-layout';
import { authProvider, LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';

import i18nProvider from './config/i18nProvider';
import dataProvider from './config/dataProvider';
import * as resources from './resources';

const AppBarWithUserMenu = props => <AppBar userMenu={<UserMenu />} {...props} />;
const LayoutWithUserMenu = props => <Layout {...props} appBar={AppBarWithUserMenu} />;

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
    {Object.entries(resources).map(([key, resource]) => (
      <Resource key={key} name={key} {...resource.config} />
    ))}
  </Admin>
);

export default App;
