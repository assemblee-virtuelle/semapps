import React from 'react';
import { Resource, usePermissionsOptimized } from 'react-admin';
import { rightsToList, rightsToCreate } from '../constants';

const ResourceWithPermission = ({ name, list, create, ...rest }) => {
  const { permissions } = usePermissionsOptimized(name);
  return (
    <Resource
      {...rest}
      name={name}
      list={permissions && permissions.some(p => rightsToList.includes(p['acl:mode'])) ? list : undefined}
      create={permissions && permissions.some(p => rightsToCreate.includes(p['acl:mode'])) ? create : undefined}
    />
  );
};

export default ResourceWithPermission;
