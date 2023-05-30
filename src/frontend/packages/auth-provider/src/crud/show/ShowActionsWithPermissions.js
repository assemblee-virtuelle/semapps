import React from 'react';
import { EditButton, ListButton, TopToolbar, usePermissions, useResourceDefinition, useRecordContext } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToEdit } from '../../constants';

const ShowActionsWithPermissions = () => {
  const { hasList, hasEdit } = useResourceDefinition();
  const record = useRecordContext();
  const { permissions } = usePermissions(record?.id);
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
