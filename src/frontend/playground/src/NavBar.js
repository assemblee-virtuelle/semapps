import React from 'react';
import { Link } from '@reach/router';
import useAuth from './auth/useAuth';
import resourcesTypes from './resourcesTypes';

const NavBar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info">
      <div className="container">
        <span className="navbar-brand">SemApps Playground</span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {Object.keys(resourcesTypes).map(type => (
              <li className="nav-item" key={type}>
                <Link to={`/resources/${type}`} className="nav-link">
                  {resourcesTypes[type]['name']}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/*<Link to="/messages" className="float-right ">*/}
        {/*  <button className="btn btn-outline-dark" type="submit">*/}
        {/*    <i className="fa fa-envelope"></i>*/}
        {/*  </button>*/}
        {/*</Link>*/}
        {/*&nbsp;*/}
        <Link to="/profile" className="float-right ">
          <button className="btn btn-outline-dark" type="submit">
            <i className="fa fa-user-o"></i>&nbsp;
            {user ? user['foaf:name'] || user.name : 'Se connecter'}
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
