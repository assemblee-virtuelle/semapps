import React from 'react';
import { DeleteButton, useGetRecordId, usePermissions } from 'react-admin';
import { rightsToDelete } from '../../constants';

const DeleteButtonWithPermissions = props => {
  const recordId = useGetRecordId();
  const { permissions, isLoading } = usePermissions({ uri: recordId });
  if (!isLoading && permissions?.some(p => rightsToDelete.includes(p['acl:mode']))) {
    return <DeleteButton {...props} />;
  }
  return null;
};

export default DeleteButtonWithPermissions;
