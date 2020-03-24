import React from 'react';
import { Link } from '@reach/router';
import useQuery from './api/useQuery';
import { getResourceId } from './utils';

const ResourcePreview = ({ resourceUri, type }) => {
  const { data: resource } = useQuery(resourceUri);
  const resourceId = resource && getResourceId(resourceUri, type);
  return (
    resource &&
    resourceId && (
      <>
        <div className="card w25">
          <div className="card-body">
            <h5 className="card-title">
              {resource.preferedLabel || resource['pair:preferedLabel'] || resource.name || resource['foaf:name']}
            </h5>
            <Link to={'/resources/' + type + '/' + resourceId} className="btn btn-primary">
              Voir
            </Link>
          </div>
        </div>
        <br />
      </>
    )
  );
};

export default ResourcePreview;
