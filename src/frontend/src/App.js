import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import initStore from './api/initStore';
import CreateUserForm from './forms/CreateUserForm';
import EditUserForm from './forms/EditUserForm';
import UserProfile from './UserProfile';
import Users from './Users';
import MyProfileForm from "./forms/MyProfileForm";

const store = initStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router primary={false}>
        <Users path="/" />
        <MyProfileForm path="/profile" />
        <CreateUserForm path="users/create" />
        <UserProfile path="users/:userId" />
        <EditUserForm path="users/:userId/edit" />
      </Router>
    </Provider>
  );
};

export default App;
