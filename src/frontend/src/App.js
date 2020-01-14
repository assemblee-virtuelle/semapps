import React, { useState,useEffect }  from 'react';
import { Router, Link, redirectTo,Redirect } from '@reach/router';
import { Provider } from 'react-redux';
import initStore from './api/initStore';
import CreateUserForm from './forms/CreateUserForm';
import EditUserForm from './forms/EditUserForm';
import UserProfile from './UserProfile';
import Users from './Users';
// import  { Redirect } from 'react-router-dom'


const store = initStore();

const App = () => {
  const [authentification, setAuthentification] = useState(true);
  const activAuth = async ()=> {

    let search = window.location.search.split('?')[1];
    let urlToken = undefined;
    if (search !== undefined) {
      let params = search.split('&').map(param => {
        let terms = param.split('=')
        return {
          key: terms[0],
          value: terms[1]
        }
      });
      let urlToken = params.filter(r => r.key == 'token')[0];

      if (urlToken !== undefined) {
        // console.log('urlToken', urlToken.value);
        localStorage.setItem('token', urlToken.value);
        let cleanurl=window.location.origin+window.location.pathname+window.location.hash;
        window.location=cleanurl;
      } else {

      }
    }
    if (urlToken === undefined) {
      let token = localStorage.getItem('token');
      console.log('token',token);
      if (token !== undefined && token !== null) {
        console.log('existing token');
      } else {
        console.log('no existing token');
        window.location='http://localhost:3000/auth'
      }

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `JWT ${token}`);


      var myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors'
      };

      try {

        let response = await fetch('http://localhost:3000/auth/me', myInit);
        if (response.status === 200) {
          let jsonResponse = await response.json();
        }
      } catch (e) {
        console.log('Request failed', e)
      } finally {

      }
    }
  }

  useEffect(() => {
     activAuth();
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
