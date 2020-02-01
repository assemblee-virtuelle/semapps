import React from 'react';
import { Link } from '@reach/router';
import useQuery from '../api/useQuery';
import ResourcePreview from '../ResourcePreview';
import resourcesTypes from '../resourcesTypes';
import Page from '../Page';

const ResourcesListPage = ({ type }) => {
  const resourceConfig = resourcesTypes[type];
  const { data } = useQuery(resourceConfig.container);
  return (
    <Page>
      <h2 className="mb-3">
        {resourceConfig.name}
        {!resourceConfig.readOnly && (
          <Link to={`/resources/${type}/create`}>
            <button className="btn btn-danger pull-right">
              <i className="fa fa-plus-circle" />
              &nbsp; Ajouter
            </button>
          </Link>
        )}
      </h2>
      {data &&
        data.map(resourceUri => (
          <div key={resourceUri}>
            <ResourcePreview resourceUri={resourceUri} type={type} /> <br />
          </div>
        ))}
    </Page>
  );
};

export default ResourcesListPage;
