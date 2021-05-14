import React, { useEffect } from 'react';
import { Edit as RaEdit, usePermissionsOptimized, useRedirect, useNotify } from 'react-admin';
import EditActions from './EditActions';
import EditToolbarWithPermissions from './EditToolbarWithPermissions';
import { rightsToEdit, rightsToControl, rightsToDelete } from '../../constants';

const EditWithPermissions = props => {
  const { permissions } = usePermissionsOptimized(props.id);
  const notify = useNotify();
  const redirect = useRedirect();
  useEffect(() => {
    if( permissions && !permissions.some(p => rightsToEdit.includes(p['acl:mode']))) {
      notify('auth.message.resource_edit_forbidden', 'error');
      redirect(props.basePath);
    }
  }, [permissions, redirect, notify]);
  return (
    <RaEdit
      actions={
        <EditActions hasControl={!!permissions && permissions.some(p => rightsToControl.includes(p['acl:mode']))} />
      }
      {...props}
      permissions={permissions}
    >
      {React.cloneElement(props.children, {
        toolbar: (
          <EditToolbarWithPermissions
            hasDelete={!!permissions && permissions.some(p => rightsToDelete.includes(p['acl:mode']))}
          />
        )
      })}
    </RaEdit>
  );
};

export default EditWithPermissions;
