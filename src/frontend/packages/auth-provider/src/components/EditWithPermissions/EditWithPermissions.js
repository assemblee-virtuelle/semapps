import React from 'react';
import { Edit as RaEdit } from 'react-admin';
import EditActions from './EditActions';
import EditToolbarWithPermissions from './EditToolbarWithPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';
import { rightsToControl } from '../../constants';

const EditWithPermissions = props => {
  const permissions = useCheckPermissions(props.id, 'edit');
  return (
    <RaEdit
      actions={
        <EditActions hasControl={!!permissions && permissions.some(p => rightsToControl.includes(p['acl:mode']))} />
      }
      {...props}
      permissions={permissions}
    >
      {React.cloneElement(props.children, {
        toolbar: <EditToolbarWithPermissions />,
        // Allow to override toolbar
        ...props.children.props
      })}
    </RaEdit>
  );
};

export default EditWithPermissions;
