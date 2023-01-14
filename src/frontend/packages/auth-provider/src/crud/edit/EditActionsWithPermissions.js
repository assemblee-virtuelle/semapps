import React from 'react';
import { usePermissionsOptimized, ShowButton, ListButton, TopToolbar, useResourceDefinition } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl } from '../../constants';

const EditActionsWithPermissions = ({ record }) => {
  const { hasList, hasShow } = useResourceDefinition();
  const { permissions } = usePermissionsOptimized(record?.id);
  return (
    <TopToolbar>
      {hasList && <ListButton record={record} />}
      {hasShow && <ShowButton record={record} />}
      {!!permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton record={record} />
      )}
    </TopToolbar>
  );
};

export default EditActionsWithPermissions;
