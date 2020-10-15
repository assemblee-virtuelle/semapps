import React, { forwardRef } from 'react';
import { useLogout, useGetIdentity } from 'react-admin';

import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  const { identity } = useGetIdentity();
  return (
    <>
      {identity && <MenuItem>{identity.name}</MenuItem>}
      <MenuItem onClick={logout} ref={ref}>
        <ExitIcon />
        &nbsp; Se déconnecter
      </MenuItem>
    </>
  );
});

export default LogoutButton;
