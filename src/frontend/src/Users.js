import React from 'react';
import useQuery from './api/useQuery';
import UserPreview from './UserPreview';
import { CONTAINER_URI } from './config';
import Page from './Page';

const Users = () => {
  const { data: usersUris } = useQuery(CONTAINER_URI);
  return (
    <Page>
      <h2> Liste des utilisateurs </h2>{' '}
      {usersUris &&
        usersUris.map(userUri => (
          <div key={userUri}>
            <UserPreview userUri={userUri} /> <br />
          </div>
        ))}{' '}
    </Page>
  );
};

export default Users;
