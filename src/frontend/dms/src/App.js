import React from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider, authProvider, httpClient } from './semapps';
import LogoutButton from './auth/LogoutButton';
import { ActorList, ActorShow, ActorIcon } from './resources/actors';
import { ActivityList, ActivityIcon } from './resources/activities';
import { ActionList, ActionShow, ActionEdit, ActionIcon } from './resources/actions';
import { NoteList, NoteEdit, NoteIcon } from './resources/notes';
import { ThemeList, ThemeIcon } from './resources/themes';
import { DeviceList, DeviceIcon } from './resources/devices';
import { NotificationList, NotificationIcon } from './resources/notifications';
import ontologies from './config/ontologies';
import resources from './config/resources';

function App() {
  return (
    <Admin
      dataProvider={dataProvider({
        sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
        httpClient,
        resources,
        ontologies,
        mainOntology: 'as'
      })}
      authProvider={authProvider(process.env.REACT_APP_MIDDLEWARE_URL)}
      logoutButton={LogoutButton}
    >
      <Resource name="Actor" list={ActorList} show={ActorShow} icon={ActorIcon} options={{ label: 'Acteurs' }} />
      <Resource name="Activity" list={ActivityList} icon={ActivityIcon} options={{ label: 'Activités' }} />
      <Resource
        name="Project"
        list={ActionList}
        show={ActionShow}
        edit={ActionEdit}
        icon={ActionIcon}
        options={{ label: 'Actions' }}
      />
      <Resource name="Note" list={NoteList} edit={NoteEdit} icon={NoteIcon} options={{ label: 'Actualités' }} />
      <Resource name="Theme" list={ThemeList} icon={ThemeIcon} options={{ label: 'Thèmes' }} />
      <Resource name="Device" list={DeviceList} icon={DeviceIcon} options={{ label: 'Appareils' }} />
      <Resource
        name="Notification"
        list={NotificationList}
        icon={NotificationIcon}
        options={{ label: 'Notifications' }}
      />
      <Resource name="Tag" />
    </Admin>
  );
}

export default App;
