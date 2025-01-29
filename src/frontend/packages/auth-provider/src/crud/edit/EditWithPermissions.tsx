import React, { PropsWithChildren } from 'react';
import { Edit, EditProps, useGetRecordId } from 'react-admin';
import EditActionsWithPermissions from './EditActionsWithPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const EditWithPermissions = ({
  actions = <EditActionsWithPermissions />,
  children,
  ...rest
}: PropsWithChildren<EditProps>) => {
  const recordId = useGetRecordId() as string;
  useCheckPermissions(recordId, 'edit');

  return (
    <Edit actions={actions} {...rest}>
      {children}
    </Edit>
  );
};

export default EditWithPermissions;
