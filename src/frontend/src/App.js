import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
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
    <Provider store={store}>
      <Router primary={false}>
        <ResourcesListPage path="/" />
        <ResourceCreatePage path="/resources/create" />
        <ResourceEditPage path="/resources/:resourceId/edit" />
        <ResourceDeletePage path="/resources/:resourceId/delete" />
        <ResourceViewPage path="/resources/:resourceId" />
        <MyProfilePage path="/profile" />
      </Router>
    </Provider>
  );
};

export default App;
