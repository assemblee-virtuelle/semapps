import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider, authProvider, httpClient } from './semapps';
import LogoutButton from './auth/LogoutButton';
import { ActorList, ActorShow, ActorIcon } from './resources/actors';
import { ActivityList, ActivityIcon } from './resources/activities';
import { ActionList, ActionShow, ActionEdit, ActionIcon } from './resources/actions';
import { NoteList, NoteEdit, NoteIcon } from './resources/notes';
import { ThemeList, ThemeIcon } from './resources/themes';
// import { ProjectList, ProjectEdit, ProjectCreate, ProjectIcon } from './resources/projects';
// import { OrganizationList, OrganizationEdit, OrganizationCreate, OrganizationIcon } from './resources/organizations';
// import { PersonList, PersonIcon } from './resources/persons';
// import { ConceptList, ConceptIcon } from './resources/concepts';

function App() {
  return (
    <Admin
      dataProvider={dataProvider(process.env.REACT_APP_MIDDLEWARE_URL, httpClient)}
      authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
      logoutButton={LogoutButton}
    >
      <Resource name="as-Person" list={ActorList} show={ActorShow} icon={ActorIcon} options={{ label: 'Acteurs' }} />
      <Resource name="activities" list={ActivityList} icon={ActivityIcon} options={{ label: 'Activités' }} />
      <Resource
        name="pair-Project"
        list={ActionList}
        show={ActionShow}
        edit={ActionEdit}
        icon={ActionIcon}
        options={{ label: 'Actions' }}
      />
      <Resource name="as-Note" list={NoteList} edit={NoteEdit} icon={NoteIcon} options={{ label: 'Actualités' }} />
      <Resource name="pair-Thema" list={ThemeList} icon={ThemeIcon} options={{ label: 'Thèmes' }} />
      {/*<Resource name="pairv1-Organization" list={OrganizationList} edit={OrganizationEdit} create={OrganizationCreate} icon={OrganizationIcon} options={{ label: 'Organisations' }}/>*/}
      {/*<Resource name="pairv1-Person" list={PersonList} icon={PersonIcon} options={{ label: 'Contributeurs' }}/>*/}
      {/*<Resource name="skos-Concept"list={ConceptList} icon={ConceptIcon} options={{ label: 'Concepts' }}/>*/}
    </Admin>
  );
}

export default App;
