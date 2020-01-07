import React from 'react';
import { Router, Link } from '@reach/router';
import { Provider } from 'react-redux';
import initStore from './api/initStore';
import CreateUser from './CreateUser';
import UserProfile from './UserProfile';
import Users from './Users';

const store = initStore();

const App = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <div className="container">
          <span className="navbar-brand">SemApps Playground</span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Créer un utilisateur
                </Link>
              </li>
              <li className="nav-item">
                <Link to="users" className="nav-link">
                  Liste des utilisateurs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br />
      <Provider store={store}>
        <Router primary={false}>
          <CreateUser path="/" />
          <Users path="users" />
          <UserProfile path="users/:userId" />
        </Router>
      </Provider>
    </>
  );
};

export default App;
