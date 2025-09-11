import React from 'react';
import { Show, ShowProps, useGetRecordId } from 'react-admin';
import ShowActionsWithPermissions from './ShowActionsWithPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const ShowWithPermissions = ({ actions, ...rest }: ShowProps) => {
  const recordId = useGetRecordId() as string;
  useCheckPermissions(recordId, 'show');
  return <Show actions={actions || <ShowActionsWithPermissions />} {...rest} />;
};

export default ShowWithPermissions;
