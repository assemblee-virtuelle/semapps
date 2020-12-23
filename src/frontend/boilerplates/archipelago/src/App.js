import React from 'react';
import { Admin, Resource } from 'react-admin';
import { AppBar } from '@semapps/archipelago-layout';
import { authProvider, LoginPage, LogoutButton, UserMenu } from '@semapps/auth-provider';

import i18nProvider from './config/i18nProvider';
import dataProvider from './config/dataProvider';
import * as resources from './resources';

import Layout from './layout/Layout';
import theme from './layout/theme';
import Home from './pages/Home/Home';

const LayoutWithUserMenu = props => <Layout appBar={<AppBar userMenu={<UserMenu />} />} {...props} />;

const App = () => (
  <Admin
    authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    layout={Layout}
    theme={theme}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
    dashboard={Home}
  >
    {Object.entries(resources).map(([key, resource]) => (
      <Resource key={key} name={key} {...resource.config} />
    ))}
  </Admin>
);

export default App;
