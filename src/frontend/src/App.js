import React from 'react';
import { Router, Redirect } from '@reach/router';
import { Provider as ReduxProvider } from 'react-redux';
import UserProvider from './auth/UserProvider';
import initStore from './redux/initStore';
import ResourceEditPage from './pages/ResourceEditPage';
import ResourceViewPage from './pages/ResourceViewPage';
import ResourcesListPage from './pages/ResourcesListPage';
import ResourceCreatePage from './pages/ResourceCreatePage';
import ResourceDeletePage from './pages/ResourceDeletePage';
import MyProfilePage from './pages/MyProfilePage';
import MessagesPage from './pages/MessagesPage';
import './App.scss';

const store = initStore();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <UserProvider>
        <Router primary={false}>
          <Redirect noThrow from="/" to="/resources/projects" />
          <ResourcesListPage path="/resources/:type" />
          <ResourceCreatePage path="/resources/:type/create" />
          <ResourceEditPage path="/resources/:type/:resourceId/edit" />
          <ResourceDeletePage path="/resources/:type/:resourceId/delete" />
          <ResourceViewPage path="/resources/:type/:resourceId" />
          <MyProfilePage path="/profile" />
          <MessagesPage path="/messages" />
        </Router>
      </UserProvider>
    </ReduxProvider>
  );
};

export default App;
