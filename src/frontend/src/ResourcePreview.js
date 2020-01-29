import React from 'react';
import { Link } from '@reach/router';
import useQuery from './api/useQuery';
import { getResourceId } from './utils';

const ResourcePreview = ({ resourceUri }) => {
  const { data: resource } = useQuery(resourceUri);
  return (
    resource && (
      <div className="card w25">
        <div className="card-body">
          <h5 className="card-title">{resource.label || resource['pair:label']}</h5>
          <Link to={'/resources/' + getResourceId(resourceUri)} className="btn btn-warning">
            Voir
          </Link>
        </div>
      </div>
    )
  );
};

export default ResourcePreview;
