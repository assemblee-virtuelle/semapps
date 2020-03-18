import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider, authProvider, httpClient } from './semapps';
import LogoutButton from './auth/LogoutButton';
import { ActionList, ActionEdit, ActionCreate, ActionIcon } from './resources/actions';
import { ThemeList, ThemeIcon } from './resources/themes';
// import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
// import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';
// import { PersonList, PersonIcon } from './resources/persons';
// import { ConceptList, ConceptIcon } from './resources/concepts';

function App() {
  return (
    <Admin
      dataProvider={dataProvider(process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/', httpClient)}
      authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
      logoutButton={LogoutButton}
    >
      <Resource
        name="pair-Project"
        list={ActionList}
        edit={ActionEdit}
        create={ActionCreate}
        icon={ActionIcon}
        options={{ label: 'Actions' }}
      />
      <Resource name="pair-Thema" list={ThemeList} icon={ThemeIcon} options={{ label: 'Thèmes' }} />
      {/*<Resource name="pairv1-Organization" list={OrganizationList} edit={OrganizationEdit} create={OrganizationCreate} icon={OrganizationIcon} options={{ label: 'Organisations' }}/>*/}
      {/*<Resource name="pairv1-Person" list={PersonList} icon={PersonIcon} options={{ label: 'Contributeurs' }}/>*/}
      {/*<Resource name="skos-Concept"list={ConceptList} icon={ConceptIcon} options={{ label: 'Concepts' }}/>*/}
    </Admin>
  );
}

export default App;
