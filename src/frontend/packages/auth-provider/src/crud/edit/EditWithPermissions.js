import React from 'react';
import { Edit, useGetRecordId } from 'react-admin';
import EditActionsWithPermissions from './EditActionsWithPermissions';
import EditToolbarWithPermissions from './EditToolbarWithPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const EditWithPermissions = props => {
  const recordId = useGetRecordId();
  useCheckPermissions(recordId, 'edit');
  return (
    <Edit {...props}>
      {React.cloneElement(props.children, {
        toolbar: <EditToolbarWithPermissions />,
        // Allow to override toolbar
        ...props.children.props
      })}
    </Edit>
  );
};

EditWithPermissions.defaultProps = {
  actions: <EditActionsWithPermissions />
};

export default EditWithPermissions;
