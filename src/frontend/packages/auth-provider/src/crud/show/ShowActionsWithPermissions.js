import React from 'react';
import { EditButton, ListButton, TopToolbar, usePermissionsOptimized, useResourceDefinition } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToEdit } from '../../constants';

const ShowActionsWithPermissions = ({ record }) => {
  const { hasList, hasEdit } = useResourceDefinition();
  const { permissions } = usePermissionsOptimized(record?.id);
  return (
    <TopToolbar>
      {hasList && <ListButton record={record} />}
      {hasEdit && permissions && permissions.some(p => rightsToEdit.includes(p['acl:mode'])) && (
        <EditButton record={record} />
      )}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton record={record} />
      )}
    </TopToolbar>
  );
};

export default ShowActionsWithPermissions;
