import React from 'react';
import { Show as RaShow, usePermissions } from 'react-admin';
import ShowActions from './ShowActions';
import { rightsToEdit } from '../rights';

const ShowWithPermissions = props => {
  const { loaded, permissions } = usePermissions(props.id);
  return (
    <RaShow
      actions={<ShowActions />}
      {...props}
      permissions={permissions}
      hasEdit={loaded && permissions.some(p => rightsToEdit.includes(p))}
    />
  );
};

export default ShowWithPermissions;
