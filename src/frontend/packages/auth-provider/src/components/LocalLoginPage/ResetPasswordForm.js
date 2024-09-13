import React from 'react';
import { Form, TextInput, required, useTranslate, useNotify, useSafeSetState, useAuthProvider } from 'react-admin';
import { Button, CardContent } from '@mui/material';

const ResetPasswordForm = () => {
  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();
  const translate = useTranslate();
  const notify = useNotify();

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
      <CardContent>
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
        <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
          {translate('auth.action.submit')}
        </Button>
      </CardContent>
    </Form>
  );
};

export default ResetPasswordForm;
