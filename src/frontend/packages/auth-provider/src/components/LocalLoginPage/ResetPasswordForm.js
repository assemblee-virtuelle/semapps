import React from 'react';
import { Form, TextInput, required, useTranslate, useNotify, useSafeSetState, useAuthProvider } from 'react-admin';
import { Button, CardContent, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(0.3)
  }
}));

const ResetPasswordForm = () => {
  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();

  const submit = values => {
    setLoading(true);
    authProvider
      .resetPassword({ ...values })
      .then(res => {
        setLoading(false);
        notify('auth.notification.reset_password_submitted', { type: 'info' });
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
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
      });
  };

  return (
    <Form onSubmit={submit}>
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
            translate('auth.action.submit')
          )}
        </Button>
      </CardContent>
    </Form>
  );
};

export default ResetPasswordForm;
