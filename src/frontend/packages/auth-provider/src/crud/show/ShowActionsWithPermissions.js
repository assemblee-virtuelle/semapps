import React from 'react';
import {
  EditButton,
  ListButton,
  TopToolbar,
  usePermissions,
  useResourceDefinition,
  useRecordContext,
} from 'react-admin';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToEdit } from '../../constants';

const ShowActionsWithPermissions = () => {
  const { hasList, hasEdit } = useResourceDefinition();
  const record = useRecordContext();
  const { permissions } = usePermissions(record?.id);
  return (
    <TopToolbar>
      {hasList && <ListButton />}
      {hasEdit && permissions && permissions.some((p) => rightsToEdit.includes(p['acl:mode'])) && <EditButton />}
      {permissions && permissions.some((p) => rightsToControl.includes(p['acl:mode'])) && <PermissionsButton />}
    </TopToolbar>
  );
};

export default ShowActionsWithPermissions;
