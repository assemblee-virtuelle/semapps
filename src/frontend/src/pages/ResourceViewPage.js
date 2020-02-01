import React from 'react';
import { Link } from '@reach/router';
import { CONTAINER_URI } from '../config';
import useQuery from '../api/useQuery';
import Page from '../Page';
import { nl2br } from '../utils';

const ResourceViewPage = ({ resourceId }) => {
  const resourceUri = `${CONTAINER_URI}/${resourceId}`;
  const { data: resource } = useQuery(resourceUri);

  // TODO improve this code, that we must do since sometimes the LDP server
  // returns the webpage as an object with the value in the @id property
  let webPage;
  if (resource) webPage = resource.webPage || resource['pair:webPage'];
  if (typeof webPage === 'object') webPage = webPage['@id'];

  return (
    <Page>
      {resource && (
        <>
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
              <div>
                <a href={webPage} target="_blank" rel="noopener noreferrer">
                  {webPage}
                </a>
              </div>
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
        </>
      )}
    </Page>
  );
};

export default ResourceViewPage;
