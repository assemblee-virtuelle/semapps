import React, { useEffect } from 'react';
import { Router, Link } from '@reach/router';
import { Provider } from 'react-redux';
import initStore from './api/initStore';
import CreateUserForm from './forms/CreateUserForm';
import EditUserForm from './forms/EditUserForm';
import UserProfile from './UserProfile';
import Users from './Users';
import config from './config.js';

const store = initStore();

const App = () => {
  const auth = async () => {
    let search = window.location.search.split('?')[1];
    let urlToken = undefined;
    //If url contains token param provide by server, this token is stored in localStorage and front relod without this token
    if (search !== undefined) {
      let params = search.split('&').map(param => {
        let terms = param.split('=');
        return {
          key: terms[0],
          value: terms[1]
        };
      });
      urlToken = params.filter(r => r.key === 'token')[0];
      if (urlToken !== undefined) {
        // console.log('urlToken', urlToken.value);
        localStorage.setItem('token', urlToken.value);
        let cleanurl = window.location.origin + window.location.pathname + window.location.hash;
        window.location = cleanurl;
      } else {
      }
    }
    // Read Token in localStorage and call API to obtain user info (identification and authentification)
    // Not excuted if browser reloding in previous code. UrlToken is shared betwen 2 parts to bring optimisation
    if (urlToken === undefined) {
      let token = localStorage.getItem('token');
      //If token isn't in localStorage nor in the url browser is redirected to auth url
      if (token === undefined || token === null) {
        console.log('redirect');
        window.location = `${config.MIDDLEWARE_URL}auth`;
      }
      //Else user info (authntification and identificaiton) is fetch with token in header
      else {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `JWT ${token}`);

        var myInit = {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors'
        };
        try {
          let response = await fetch(`${config.MIDDLEWARE_URL}auth/me`, myInit);
          if (response.status === 200) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
          } else {
            console.error(`User Info Request failed : ${response.status} ${response.statusText}`);
          }
        } catch (e) {
          console.error('User Info Request failed', e);
        }
      }
    }
  };

  useEffect(() => {
    auth();
  }, []);

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
      <div className="container">
        <Provider store={store}>
          <Router primary={false}>
            <CreateUserForm path="/" />
            <Users path="users" />
            <UserProfile path="users/:userId" />
            <EditUserForm path="users/:userId/edit" />
          </Router>
        </Provider>
      </div>
    </>
  );
};

export default App;
