import React from 'react';
import { EditButton, useGetRecordId, usePermissions } from 'react-admin';
import { rightsToEdit } from '../../constants';

const EditButtonWithPermissions = (props: any) => {
  const recordId = useGetRecordId();
  const { permissions, isLoading } = usePermissions({ uri: recordId });
  if (!isLoading && permissions?.some((p: any) => rightsToEdit.includes(p['acl:mode']))) {
    return <EditButton {...props} />;
  }
  return null;
};

export default EditButtonWithPermissions;
