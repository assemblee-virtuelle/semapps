import React from 'react';
import { DeleteButton, useRecordContext, usePermissionsOptimized } from 'react-admin';
import { rightsToDelete } from '../../constants';

const DeleteButtonWithPermissions = props => {
  const record = useRecordContext();
  const { permissions } = usePermissionsOptimized(record?.id);
  if (!!permissions && permissions.some(p => rightsToDelete.includes(p['acl:mode']))) {
    return <DeleteButton {...props} />;
  } else {
    return null;
  }
};

export default DeleteButtonWithPermissions;
