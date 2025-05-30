import React from 'react';
import { useLogin, useTranslate } from 'react-admin';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const AuthDialog = ({
  open,
  onClose,
  title = 'auth.dialog.login_required',
  message = 'auth.message.login_to_continue',
  redirect,
  ...rest
}) => {
  const login = useLogin();
  const translate = useTranslate();
  return (
    <Dialog open={open} onClose={onClose} {...rest}>
      <DialogTitle>{translate(title)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{translate(message)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translate('ra.action.cancel')}</Button>
        <Button
          onClick={() => login({ redirect: redirect || window.location.pathname + window.location.search })}
          color="primary"
          variant="contained"
        >
          {translate('auth.action.login')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
