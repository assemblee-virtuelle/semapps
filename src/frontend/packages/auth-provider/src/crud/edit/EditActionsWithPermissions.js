import React from 'react';
import { usePermissionsOptimized, ShowButton, ListButton, TopToolbar, useResourceDefinition, useRecordContext } from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl } from '../../constants';

const EditActionsWithPermissions = () => {
  const { hasList, hasShow } = useResourceDefinition();
  const record = useRecordContext();
  const { permissions } = usePermissionsOptimized(record?.id);
  return (
    <TopToolbar>
      {hasList && <ListButton />}
      {hasShow && <ShowButton />}
      {!!permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && (
        <PermissionsButton />
      )}
    </TopToolbar>
  );
};

export default EditActionsWithPermissions;
