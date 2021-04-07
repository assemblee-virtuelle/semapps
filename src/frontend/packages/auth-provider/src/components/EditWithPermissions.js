import React from 'react';
import { Edit as RaEdit, usePermissions } from 'react-admin';
import EditActions from './EditActions';
import EditToolbarWithPermissions from './EditToolbarWithPermissions';
import { rightsToDelete } from '../rights';

const EditWithPermissions = props => {
  const { loaded, permissions } = usePermissions(props.id);
  return (
    <RaEdit actions={<EditActions />} {...props} permissions={permissions}>
      {React.cloneElement(props.children, {
        toolbar: <EditToolbarWithPermissions hasDelete={loaded && permissions.some(p => rightsToDelete.includes(p))} />
      })}
    </RaEdit>
  );
};

export default EditWithPermissions;
