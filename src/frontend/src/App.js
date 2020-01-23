import React from 'react';
import { Router } from '@reach/router';
import { Provider as ReduxProvider } from 'react-redux';
import UserProvider from './auth/UserProvider';
import initStore from './api/initStore';
import ResourceEditPage from './pages/ResourceEditPage';
import ResourceViewPage from './pages/ResourceViewPage';
import ResourcesListPage from './pages/ResourcesListPage';
import ResourceCreatePage from './pages/ResourceCreatePage';
import ResourceDeletePage from './pages/ResourceDeletePage';
import MyProfilePage from './pages/MyProfilePage';

const store = initStore();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <UserProvider>
        <Router primary={false}>
          <ResourcesListPage path="/" />
          <ResourceCreatePage path="/resources/create" />
          <ResourceEditPage path="/resources/:resourceId/edit" />
          <ResourceDeletePage path="/resources/:resourceId/delete" />
          <ResourceViewPage path="/resources/:resourceId" />
          <MyProfilePage path="/profile" />
        </Router>
      </UserProvider>
    </ReduxProvider>
  );
};

export default App;
