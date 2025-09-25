import React from 'react';
import { DeleteButton, useGetRecordId, usePermissions } from 'react-admin';
import { rightsToDelete } from '../../constants';

const DeleteButtonWithPermissions = (props: any) => {
  const recordId = useGetRecordId();
  const { permissions, isLoading } = usePermissions({ uri: recordId });
  if (!isLoading && permissions?.some((p: any) => rightsToDelete.includes(p['acl:mode']))) {
    return <DeleteButton {...props} />;
  }
  return null;
};

export default DeleteButtonWithPermissions;
