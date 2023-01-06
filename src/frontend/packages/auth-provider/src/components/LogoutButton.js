import React, { forwardRef } from 'react';
import { useLogout, useTranslate } from 'react-admin';
import { MenuItem, ListItemIcon } from '@mui/material';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import { styled } from '@mui/system';


const StyledIcon = styled('div')(({ theme }) => ({
  minWidth: theme.spacing(5)
}));

const StyledMenuItem = styled('div')(({ theme }) => ({ 
  color: theme.palette.text ? theme.palette.text.secondary: 'unset',
  '&:active': {
    color: theme.palette.text ? theme.palette.text.primary: 'unset'
  }
}));

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  const translate = useTranslate();
  return (
    <StyledMenuItem>
      <MenuItem onClick={() => logout()} ref={ref}>
        <StyledIcon>
          <ListItemIcon>
            <ExitIcon />
          </ListItemIcon>
        </StyledIcon>
        {translate('auth.action.logout')}
      </MenuItem>
    </StyledMenuItem>
  );
});

export default LogoutButton;
