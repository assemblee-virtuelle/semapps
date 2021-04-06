import React from 'react';
import { Resource, usePermissions } from 'react-admin';
import { rightsToList, rightsToCreate } from "../rights";

const ResourceWithPermission = ({ name, list, create, ...rest }) => {
  const { permissions } = usePermissions(name);
  return(
    <Resource
      {...rest}
      name={name}
      list={permissions && permissions.some(p => rightsToList.includes(p)) ? list : undefined}
      create={permissions && permissions.some(p => rightsToCreate.includes(p)) ? create : undefined}
    />
  );
};

export default ResourceWithPermission;
