import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import initStore from './api/initStore';
import CreateUserForm from './forms/CreateUserForm';
import EditUserForm from './forms/EditUserForm';
import UserProfile from './UserProfile';
import Users from './Users';

const store = initStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router primary={false}>
        <Users path="/" />
        <CreateUserForm path="users/create" />
        <UserProfile path="users/:userId" />
        <EditUserForm path="users/:userId/edit" />
      </Router>
    </Provider>
  );
};

export default App;
