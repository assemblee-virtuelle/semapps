import React from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './config/dataProvider';
import { NoteList, NoteEdit, NoteCreate, NoteIcon } from './resources/notes';

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="Note"
      list={NoteList}
      edit={NoteEdit}
      create={NoteCreate}
      icon={NoteIcon}
      options={{ label: 'Notes' }}
    />
  </Admin>
);

export default App;
