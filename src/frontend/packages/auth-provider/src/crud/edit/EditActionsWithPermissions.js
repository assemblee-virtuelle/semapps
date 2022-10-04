import React from 'react';
import { usePermissionsOptimized, ShowButton, ListButton, TopToolbar } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl } from '../../constants';

const EditActionsWithPermissions = ({ basePath, record, hasList, hasShow }) => {
  const { permissions } = usePermissionsOptimized(record.id);
  return (
    <TopToolbar>
      {hasList && <ListButton basePath={basePath} record={record} />}
      {hasShow && <ShowButton basePath={basePath} record={record} />}
      {!!permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton basePath={basePath} record={record} />
      )}
    </TopToolbar>
  );
};

export default EditActionsWithPermissions;
