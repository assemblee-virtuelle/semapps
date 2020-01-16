import React from 'react';
import useQuery from './api/useQuery';
import UserPreview from './UserPreview';
import { CONTAINER_URI } from './config';

const Users = () => {
  const { data: usersUris } = useQuery(CONTAINER_URI, {
    headers: {
      Authorization: `JWT ${localStorage.getItem('token')}`
    }
  });
  return (
    <div className="container">
      <h2> Liste des utilisateurs </h2>{' '}
      {usersUris &&
        usersUris.map(userUri => (
          <div key={userUri}>
            <UserPreview userUri={userUri} /> <br />
          </div>
        ))}{' '}
    </div>
  );
};

export default Users;
