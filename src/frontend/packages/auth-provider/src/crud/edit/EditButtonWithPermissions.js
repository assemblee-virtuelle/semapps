import React from 'react';
import { EditButton, useGetRecordId, usePermissions } from 'react-admin';
import { rightsToEdit } from '../../constants';

const EditButtonWithPermissions = props => {
  const recordId = useGetRecordId();
  const { permissions, isLoading } = usePermissions({ uri: recordId });
  if (!isLoading && permissions?.some(p => rightsToEdit.includes(p['acl:mode']))) {
    return <EditButton {...props} />;
  }
  return null;
};

export default EditButtonWithPermissions;
