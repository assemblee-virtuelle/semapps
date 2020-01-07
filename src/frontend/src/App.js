import React from 'react';
import { Router, Link } from '@reach/router';
import CreateUser from './CreateUser';
import Profile from './Profile';
import Users from './Users';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p className="App-logo">SemApps Playground</p>
      </header>
      <nav>
        <Link to="/">Création utilisateur</Link> |&nbsp;
        <Link to="users">Liste utilisateurs</Link>
      </nav>
      <Router>
        <CreateUser path="/" />
        <Users path="users" />
        <Profile path="users/:userId" />
      </Router>
    </div>
  );
};

export default App;
