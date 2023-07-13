import React from 'react';
import { EditButton, useGetRecordId, usePermissions } from 'react-admin';
import { rightsToEdit } from '../../constants';

const EditButtonWithPermissions = props => {
  const recordId = useGetRecordId();
  const { permissions, isLoading } = usePermissions(recordId);
  if (!isLoading && permissions?.some(p => rightsToEdit.includes(p['acl:mode']))) {
    return <EditButton {...props} />
  } else {
    return null;
  }
};

export default EditButtonWithPermissions;
