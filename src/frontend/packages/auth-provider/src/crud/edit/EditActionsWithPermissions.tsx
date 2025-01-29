import React from 'react';
import {
  ShowButton,
  ListButton,
  TopToolbar,
  usePermissions,
  useResourceDefinition,
  useRecordContext,
  useResourceContext
} from 'react-admin';
import { useCreateContainerUri } from '@semapps/semantic-data-provider';
import PermissionsButton from '../../components/PermissionsButton/PermissionsButton';
import { rightsToControl, rightsToList, rightsToShow } from '../../constants';
import { Permissions } from '../../types';

const EditActionsWithPermissions = () => {
  const { hasList, hasShow } = useResourceDefinition();
  const record = useRecordContext();
  const { permissions } = usePermissions<Permissions | undefined>({ uri: record?.id });

  const resource = useResourceContext();
  const containerUri = useCreateContainerUri()(resource);
  const { permissions: containerPermissions } = usePermissions<Permissions | undefined>({ uri: containerUri });

  return (
    <TopToolbar>
      {hasList && containerPermissions && containerPermissions.some(p => rightsToList.includes(p['acl:mode'])) && (
        <ListButton />
      )}
      {hasShow && permissions && permissions.some(p => rightsToShow.includes(p['acl:mode'])) && <ShowButton />}
      {permissions && permissions.some(p => rightsToControl.includes(p['acl:mode'])) && <PermissionsButton />}
    </TopToolbar>
  );
};

export default EditActionsWithPermissions;
