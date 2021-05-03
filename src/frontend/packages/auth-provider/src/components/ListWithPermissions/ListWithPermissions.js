import React from 'react';
import { usePermissionsOptimized } from 'react-admin';
import { List } from '@semapps/archipelago-layout';
import PermissionsButton from '../PermissionsButton/PermissionsButton';
import { rightsToCreate, rightsToControl } from "../../constants";

const ListWithPermissions = ({ actions, resource, ...rest }) => {
  const { permissions } = usePermissionsOptimized(resource);
  return (
    <List
      {...rest}
      resource={resource}
      hasCreate={!!(permissions && permissions.some(p => rightsToCreate.includes(p['acl:mode'])))}
      actions={permissions && permissions.some(p => rightsToControl.includes(p['acl:mode']))
        ? React.cloneElement(actions, { bulkActions: <PermissionsButton /> })
        : actions
      }
    />
  );
}

export default ListWithPermissions;
