import React, { forwardRef } from 'react';
import { useLogout } from 'react-admin';
import jwtDecode from 'jwt-decode';
import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  const handleClick = () => logout();
  const token = localStorage.getItem('token');
  const payload = token && jwtDecode(token);
  return (
    <>
      {payload && <MenuItem>{payload.name}</MenuItem>}
      <MenuItem onClick={handleClick} ref={ref}>
        <ExitIcon />
        &nbsp; Logout
      </MenuItem>
    </>
  );
});

export default LogoutButton;
