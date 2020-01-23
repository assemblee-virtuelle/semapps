import React from 'react';
import { Link } from '@reach/router';
import { CONTAINER_URI } from '../config';
import useQuery from '../api/useQuery';
import Page from '../Page';
import { nl2br } from '../utils';

const ResourceViewPage = ({ resourceId }) => {
  const resourceUri = `${CONTAINER_URI}/${resourceId}`;
  const { data: resource } = useQuery(resourceUri);

  return (
    resource && (
      <Page>
        <h2>{resource.label || resource['pair:label']}</h2>
        <ul className="list-group">
          <div className="list-group-item">
            <div>
              <strong>Titre</strong>
            </div>
            <div>{resource.label || resource['pair:label']}</div>
          </div>
          <div className="list-group-item">
            <div>
              <strong>Description</strong>
            </div>
            <div>{nl2br(resource.description || resource['pair:description'])}</div>
          </div>
          <div className="list-group-item">
            <div>
              <strong>Site web</strong>
            </div>
            <div>{resource.webPage || resource['pair:webPage']}</div>
          </div>
        </ul>
        <br />
        <Link to={`/resources/${resourceId}/edit`}>
          <button type="submit" className="btn btn-warning">
            Modifier
          </button>
        </Link>
        &nbsp; &nbsp;
        <Link to={`/resources/${resourceId}/delete`}>
          <button type="submit" className="btn btn-danger">
            Effacer
          </button>
        </Link>
      </Page>
    )
  );
};

export default ResourceViewPage;
