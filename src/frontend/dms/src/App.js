import React from 'react';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import { DataProviderContext, TranslationProvider, Resource } from 'react-admin';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { dataProvider, authProvider, httpClient } from '@semapps/react-admin';

import { ProjectList, ProjectShow, ProjectEdit, ProjectCreate } from './resources/projects';
import resources from './config/resources';
import ontologies from './config/ontologies';
import createStore from './createStore';
import Layout from './components/Layout';

const history = createHashHistory();
const theme = createMuiTheme({
  palette: {
    grey: { main: '#e0e0e0' }
  },
});
const i18nProvider = polyglotI18nProvider(locale => {
  return defaultMessages;
});

function App() {
  return (
    <Provider
      store={createStore({
        authProvider,
        dataProvider,
        history,
      })}
    >
      <DataProviderContext.Provider value={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies
      })}>
        <TranslationProvider
          locale="en"
          i18nProvider={i18nProvider}
        >
          <ThemeProvider theme={theme}>
            <Resource name="Project" intent="registration" />
            <Resource name="Organization" intent="registration" />
            <Resource name="Person" intent="registration" />
            <Resource name="Concept" intent="registration" />
            <Resource name="Agent" intent="registration" />
            <Layout>
              <ConnectedRouter history={history}>
                <Switch>
                  <Route exact path="/projects" render={(routeProps) => <ProjectList hasShow hasCreate resource="Project" basePath="/projects" {...routeProps} />} />
                  <Route exact path="/projects/create" render={(routeProps) => <ProjectCreate resource="Project" basePath="/projects" {...routeProps} />} />
                  <Route exact path="/projects/:id" render={(routeProps) => <ProjectEdit hasShow resource="Project" basePath="/projects" id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
                  <Route exact path="/projects/:id/show" render={(routeProps) => <ProjectShow hasEdit resource="Project" basePath="/projects" id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
                </Switch>
              </ConnectedRouter>
            </Layout>
          </ThemeProvider>
        </TranslationProvider>
      </DataProviderContext.Provider>
    </Provider>
  );
}

export default App;