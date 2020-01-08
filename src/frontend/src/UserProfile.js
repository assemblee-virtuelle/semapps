import React from 'react';
import { Link } from '@reach/router';
import { MIDDLEWARE_URL } from './constants';
import useQuery from './api/useQuery';

const UserProfile = ({ userId, navigate }) => {
  const { data: user } = useQuery(`${MIDDLEWARE_URL}/ldp/schema:Person/${userId}`);

  const deleteUser = async () => {
    await fetch(`${MIDDLEWARE_URL}/ldp/schema:Person/${userId}`, {
      method: 'DELETE'
    });
    navigate('/users');
  };

  return (
    user && (
      <div className="container">
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
        <Link to="/users">
          <button type="submit" className="btn btn-warning">
            Retour à la liste
          </button>
        </Link>
        &nbsp; &nbsp;
        <button type="submit" className="btn btn-danger" onClick={deleteUser}>
          Effacer le profil
        </button>
      </div>
    )
  );
};

export default UserProfile;
