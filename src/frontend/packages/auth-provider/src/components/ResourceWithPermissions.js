import React from 'react';
import { Resource, usePermissions } from 'react-admin';
import { useCreateContainer } from '@semapps/semantic-data-provider';
import { rightsToCreate } from '../constants';

// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const ResourceWithPermission = ({ name, create, ...rest }) => {
  const createContainer = useCreateContainer(name);
  const { permissions } = usePermissions(createContainer);
  return (
    <Resource
      {...rest}
      name={name}
      create={permissions?.some(p => rightsToCreate.includes(p['acl:mode'])) ? create : undefined}
      // Requesting permissions to list container is too long, we will avoid that for now
      // list={permissions && permissions.some(p => rightsToList.includes(p['acl:mode'])) ? list : undefined}
    />
  );
};

export default ResourceWithPermission;
