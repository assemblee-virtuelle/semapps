import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '@reach/router';
import { CONTAINER_URI } from './config';
import useQuery from './api/useQuery';
import { deleteResource, removeFromContainer } from './api/actions';
import useAuth from './auth/useAuth';
import Page from './Page';

const UserProfile = ({ userId, navigate }) => {
  const { isLogged, login } = useAuth();
  const userUri = `${CONTAINER_URI}/${userId}`;
  const { data: user } = useQuery(userUri);
  const dispatch = useDispatch();

  const deleteUser = async () => {
    // If user is not logged, redirect him to login page
    if (!isLogged) login();

    await fetch(userUri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await dispatch(deleteResource(userUri));
    await dispatch(removeFromContainer(CONTAINER_URI, userUri));

    navigate('/users');
  };

  return (
    user && (
      <Page>
        <h2>Profil de {user.givenName || user['schema:givenName']}</h2>
        <ul className="list-group">
          <div className="list-group-item">
            <div>
              <strong>Prénom</strong>
            </div>
            <div>{user.givenName || user['schema:givenName']}</div>
          </div>
          <div className="list-group-item">
            <div>
              <strong>Nom de famille</strong>
            </div>
            <div>{user.familyName || user['schema:familyName']}</div>
          </div>
          <div className="list-group-item">
            <div>
              <strong>Adresse email</strong>
            </div>
            <div>{user.email || user['schema:email']}</div>
          </div>
        </ul>
        <br />
        <Link to={`/users/${userId}/edit`}>
          <button type="submit" className="btn btn-warning">
            Modifier le profil
          </button>
        </Link>
        &nbsp; &nbsp;
        <button type="submit" className="btn btn-danger" onClick={deleteUser}>
          Effacer le profil
        </button>
      </Page>
    )
  );
};

export default UserProfile;
