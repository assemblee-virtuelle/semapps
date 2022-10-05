import React from 'react';
import { EditButton, ListButton, TopToolbar, usePermissionsOptimized } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToEdit } from '../../constants';

const ShowActionsWithPermissions = ({ basePath, record, hasList, hasEdit }) => {
  const { permissions } = usePermissionsOptimized(record?.id);
  return (
    <TopToolbar>
      {hasList && <ListButton basePath={basePath} record={record} />}
      {hasEdit && permissions && permissions.some(p => rightsToEdit.includes(p['acl:mode'])) && (
        <EditButton basePath={basePath} record={record} />
      )}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton basePath={basePath} record={record} />
      )}
    </TopToolbar>
  );
};

export default ShowActionsWithPermissions;
