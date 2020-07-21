import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import withContext from 'recompose/withContext';
import { DataProviderContext, AuthContext, TranslationProvider, Resource, Notification } from 'react-admin';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  dataProvider as createDataProvider,
  authProvider as createAuthProvider,
  httpClient
} from '@semapps/react-admin';

import { ProjectCreate, ProjectEdit, ProjectList, ProjectShow } from './resources/projects';
import resources from './config/resources';
import ontologies from './config/ontologies';
import createStore from './createStore';
import Layout from './components/Layout';

const history = createHashHistory();
const theme = createMuiTheme({
  palette: {
    grey: { main: '#e0e0e0' },
    primary: { main: '#61d2fe' }
  },
  typography: {
    details: {
      fontSize: 8
    }
  },
  overrides: {
    RaChipField: {
      chip: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 8,
        marginBottom: 8
      }
    }
  }
});
const i18nProvider = polyglotI18nProvider(locale => frenchMessages);
const dataProvider = createDataProvider({
  sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
  httpClient,
  resources,
  ontologies,
  mainOntology: 'pair'
});
const authProvider = createAuthProvider(process.env.REACT_APP_MIDDLEWARE_URL);

function App() {
  return (
    <Provider
      store={createStore({
        authProvider,
        dataProvider,
        history
      })}
    >
      <AuthContext.Provider value={authProvider}>
        <DataProviderContext.Provider value={dataProvider}>
          <TranslationProvider locale="fr" i18nProvider={i18nProvider}>
            <ThemeProvider theme={theme}>
              <Resource name="Project" intent="registration" />
              <Resource name="Organization" intent="registration" />
              <Resource name="Person" intent="registration" />
              <Resource name="Concept" intent="registration" />
              <Resource name="Agent" intent="registration" />
              <Layout>
                <ConnectedRouter history={history}>
                  <Switch>
                    <Route
                      exact
                      path="/projects"
                      render={routeProps => (
                        <ProjectList hasShow hasCreate resource="Project" basePath="/projects" {...routeProps} />
                      )}
                    />
                    <Route
                      exact
                      path="/projects/create"
                      render={routeProps => <ProjectCreate resource="Project" basePath="/projects" {...routeProps} />}
                    />
                    <Route
                      exact
                      path="/projects/:id"
                      render={routeProps => (
                        <ProjectEdit
                          hasShow
                          resource="Project"
                          basePath="/projects"
                          id={decodeURIComponent(routeProps.match.params.id)}
                          {...routeProps}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/projects/:id/show"
                      render={routeProps => (
                        <ProjectShow
                          hasEdit
                          resource="Project"
                          basePath="/projects"
                          id={decodeURIComponent(routeProps.match.params.id)}
                          {...routeProps}
                        />
                      )}
                    />
                  </Switch>
                </ConnectedRouter>
              </Layout>
              <Notification />
            </ThemeProvider>
          </TranslationProvider>
        </DataProviderContext.Provider>
      </AuthContext.Provider>
    </Provider>
  );
}

export default withContext({ authProvider: PropTypes.object }, () => ({ authProvider }))(App);
