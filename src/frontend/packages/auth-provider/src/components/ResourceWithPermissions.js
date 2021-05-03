import React from 'react';
import { Resource, usePermissionsOptimized } from 'react-admin';
import { rightsToCreate } from '../constants';

// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const ResourceWithPermission = ({ name, create, ...rest }) => {
  const { permissions } = usePermissionsOptimized(name);
  return (
    <Resource
      {...rest}
      name={name}
      create={permissions && permissions.some(p => rightsToCreate.includes(p['acl:mode'])) ? create : undefined}
      // Requesting permissions to list container is too long, we will avoid that for now
      // list={permissions && permissions.some(p => rightsToList.includes(p['acl:mode'])) ? list : undefined}
    />
  );
};

export default ResourceWithPermission;
