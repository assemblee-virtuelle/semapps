import React from 'react';
import { createBrowserHistory as createHistory } from 'history';
import { Admin, Resource } from 'react-admin';
import { dataProvider, authProvider, httpClient } from '@semapps/react-admin';
import LogoutButton from './auth/LogoutButton';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';
import { PersonList, PersonIcon } from './resources/persons';
import { ConceptList, ConceptIcon } from './resources/concepts';
import resources from './config/resources';
import ontologies from './config/ontologies';
import Homepage from './Homepage';
import customRoutes from './customRoutes';

const history = createHistory();

function App() {
  return (
    <Admin
      disableTelemetry
      history={history}
      title="SemApps"
      customRoutes={customRoutes}
      loginPage={false}
      dashboard={Homepage}
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies
      })}
      authProvider={authProvider(history, process.env.REACT_APP_MIDDLEWARE_URL)}
      logoutButton={LogoutButton}
    >
      {permissions => [
        permissions === 'user' && (
          <Resource
            name="Project"
            list={ProjectList}
            edit={ProjectEdit}
            create={ProjectCreate}
            icon={ProjectIcon}
            options={{ label: 'Projets' }}
          />
        ),
        permissions === 'user' && (
          <Resource
            name="Organization"
            list={OrganizationList}
            edit={OrganizationEdit}
            create={OrganizationCreate}
            icon={OrganizationIcon}
            options={{ label: 'Organisations' }}
          />
        ),
        permissions === 'user' && (
          <Resource name="Person" list={PersonList} icon={PersonIcon} options={{ label: 'Contributeurs' }} />
        ),
        permissions === 'user' && (
          <Resource name="Concept" list={ConceptList} icon={ConceptIcon} options={{ label: 'Concepts' }} />
        ),
        permissions === 'user' && <Resource name="Agent" />
      ]}
    </Admin>
  );
}

export default App;
