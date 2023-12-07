import React from 'react';
import {
  EditButton,
  ListButton,
  TopToolbar,
  usePermissions,
  useResourceDefinition,
  useRecordContext,
  useResourceContext
} from 'react-admin';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToEdit, rightsToList } from '../../constants';

const ShowActionsWithPermissions = () => {
  const { hasList, hasEdit } = useResourceDefinition();
  const record = useRecordContext();
  const { permissions } = usePermissions(record?.id);

  const resource = useResourceContext();
  const containerUri = useCreateContainerUri()(resource);
  const { permissions: containerPermissions } = usePermissions(containerUri);

  return (
    <TopToolbar>
      {hasList && containerPermissions && containerPermissions.some(p => rightsToList.includes(p['acl:mode'])) && (
        <ListButton />
      )}
      {hasEdit && permissions && permissions.some(p => rightsToEdit.includes(p['acl:mode'])) && <EditButton />}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && <PermissionsButton />}
    </TopToolbar>
  );
};

export default ShowActionsWithPermissions;
