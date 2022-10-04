import React from 'react';
import { Show } from 'react-admin';
import ShowActionsWithPermissions from './ShowActionsWithPermissions';
import useCheckPermissions from "../../hooks/useCheckPermissions";

const ShowWithPermissions = props => {
  useCheckPermissions(props.id, 'edit');
  return (
    <Show {...props} />
  );
};

ShowWithPermissions.defaultProps = {
  actions: <ShowActionsWithPermissions />
}

export default ShowWithPermissions;
