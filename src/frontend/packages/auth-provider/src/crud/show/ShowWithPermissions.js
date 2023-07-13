import React from 'react';
import { Show, useGetRecordId } from 'react-admin';
import ShowActionsWithPermissions from './ShowActionsWithPermissions';
import useCheckPermissions from '../../hooks/useCheckPermissions';

const ShowWithPermissions = props => {
  const recordId = useGetRecordId();
  useCheckPermissions(recordId, 'show');
  return <Show {...props} />;
};

ShowWithPermissions.defaultProps = {
  actions: <ShowActionsWithPermissions />
};

export default ShowWithPermissions;
