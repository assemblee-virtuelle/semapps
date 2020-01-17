import React from 'react';
import { Link } from '@reach/router';

const NavBar = () => (
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
              Liste des utilisateurs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users/create" className="nav-link">
              Créer un utilisateur
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default NavBar;

