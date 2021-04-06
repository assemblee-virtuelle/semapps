import React, { useMemo } from 'react';
import { Resource, usePermissions } from 'react-admin';

const rightsToList = ['acl:Read', 'acl:Append', 'acl:Write', 'acl:Control'];
const rightsToCreate = ['acl:Append', 'acl:Write', 'acl:Control'];

const ResourceWithPermission = ({ name, list, create, ...rest }) => {
  const permissionsRequest = useMemo(() => ({ resourceId: name }), [name]);
  const { permissions } = usePermissions(permissionsRequest);

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
