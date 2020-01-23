import React from 'react';
import useQuery from '../api/useQuery';
import ResourcePreview from '../ResourcePreview';
import { CONTAINER_URI } from '../config';
import Page from '../Page';

const ResourcesListPage = () => {
  const { data: resourcesUris } = useQuery(CONTAINER_URI);
  return (
    <Page>
      <h2> Liste des projets </h2>{' '}
      {resourcesUris &&
        resourcesUris.map(resourceUri => (
          <div key={resourceUri}>
            <ResourcePreview resourceUri={resourceUri} /> <br />
          </div>
        ))}{' '}
    </Page>
  );
};

export default ResourcesListPage;
