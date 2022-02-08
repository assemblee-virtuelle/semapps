import React, { forwardRef } from 'react';
import { useLogout, useTranslate } from 'react-admin';
import { MenuItem, makeStyles, ListItemIcon } from '@material-ui/core';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
  },
  active: {
    color: theme.palette.text.primary,
  },
  icon: { minWidth: theme.spacing(5) },
}));

const LogoutButton = forwardRef((props, ref) => {
  const classes = useStyles();
  const logout = useLogout();
  const translate = useTranslate();
  return (
    <MenuItem onClick={() => logout()} ref={ref} className={classes.root} activeClassName={classes.active}>
      <ListItemIcon className={classes.icon}>
        <ExitIcon />
      </ListItemIcon>
      {translate('auth.action.logout')}
    </MenuItem>
  );
});

export default LogoutButton;
