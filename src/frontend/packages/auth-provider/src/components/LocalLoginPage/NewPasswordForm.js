import React from 'react';
import { Form, useTranslate, useNotify, useSafeSetState, useAuthProvider, TextInput, required } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Button, CardContent, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(0.3)
  }
}));

const NewPasswordForm = ({ redirectTo }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();

  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();

  const submit = values => {
    setLoading(true);
    authProvider
      .setNewPassword({ ...values, token })
      .then(res => {
        setTimeout(() => {
          window.location.href = `/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`;
          setLoading(false);
        }, 2000);
        notify('auth.notification.password_changed', 'info');
      })
      .catch(error => {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
            ? 'auth.notification.reset_password_error'
            : error.message,
          {
            type: 'warning',
            messageArgs: {
              _: typeof error === 'string' ? error : error?.message ? error.message : undefined
            }
          }
        );
      });
  };

  return (
    <Form onSubmit={submit} noValidate defaultValues={{ email: searchParams.get('email') }}>
      <CardContent className={classes.content}>
        <TextInput
          autoFocus
          source="email"
          label={translate('auth.input.email')}
          autoComplete="email"
          fullWidth
          disabled={loading}
          validate={required()}
          format={value => (value ? value.toLowerCase() : '')}
        />
        <TextInput
          autoFocus
          type="password"
          source="password"
          label={translate('auth.input.new_password')}
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={required()}
          format={value => (value ? value.toLowerCase() : '')}
        />
        <TextInput
          autoFocus
          type="password"
          source="confirm-password"
          label={translate('auth.input.confirm_new_password')}
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={required()}
          format={value => (value ? value.toLowerCase() : '')}
        />
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          fullWidth
          className={classes.button}
        >
          {loading ? (
            <CircularProgress className={classes.icon} size={19} thickness={3} />
          ) : (
            translate('auth.action.set_new_password')
          )}
        </Button>
      </CardContent>
    </Form>
  );
};

export default NewPasswordForm;
