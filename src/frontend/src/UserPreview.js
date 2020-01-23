import React from 'react';
import { Link } from '@reach/router';
import useQuery from './api/useQuery';
import { getUserId } from './utils';

const UserPreview = ({ userUri }) => {
  const { data: user } = useQuery(userUri);
  return (
    user && (
      <div className="card w25">
        <div className="card-body">
          <h5 className="card-title">{user.givenName || user['schema:givenName']}</h5>
          <Link to={'/users/' + getUserId(userUri)} className="btn btn-warning">
            Voir
          </Link>
        </div>
      </div>
    )
  );
};

export default UserPreview;
