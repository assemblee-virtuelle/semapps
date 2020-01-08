import React from 'react';
import useQuery from './api/useQuery';
import UserPreview from './UserPreview';
import { MIDDLEWARE_URL } from './constants';

const Users = () => {
  const { data: usersUris } = useQuery(`${MIDDLEWARE_URL}/ldp/schema:Person`);
  return (
    <div className="container">
      <h2>Liste des utilisateurs</h2>
      {usersUris &&
        usersUris.map(userUri => (
          <>
            <UserPreview key={userUri} userUri={userUri} />
            <br />
          </>
        ))}
    </div>
  );
};

export default Users;
