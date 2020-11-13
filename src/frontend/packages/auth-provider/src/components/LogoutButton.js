import React, { forwardRef } from 'react';
import { useLogout } from 'react-admin';

import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  return (
    <MenuItem onClick={() => logout()} ref={ref}>
      <ExitIcon />
      &nbsp;&nbsp; Se déconnecter
    </MenuItem>
  );
});

export default LogoutButton;
