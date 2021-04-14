import React from 'react';
import { Show as RaShow, usePermissionsOptimized } from 'react-admin';
import ShowActions from './ShowActions';
import { rightsToEdit, rightsToControl } from '../rights';

const ShowWithPermissions = props => {
  const { permissions } = usePermissionsOptimized(props.id);
  return (
    <RaShow
      actions={<ShowActions hasControl={permissions && permissions.some(p => rightsToControl.includes(p['acl:mode']))} />}
      {...props}
      permissions={permissions}
      hasEdit={permissions && permissions.some(p => rightsToEdit.includes(p['acl:mode']))}
    />
  );
};

export default ShowWithPermissions;
