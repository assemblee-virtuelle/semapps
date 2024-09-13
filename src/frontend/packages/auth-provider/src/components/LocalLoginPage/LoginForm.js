import React, { useCallback } from 'react';
import { Form, useTranslate, useNotify, useSafeSetState, TextInput, required, email, useLogin } from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent } from '@mui/material';

const LoginForm = ({ onLogin, allowUsername }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const submit = useCallback(
    async values => {
      try {
        setLoading(true);
        await login(values);
        if (onLogin) {
          onLogin(redirectTo);
        } else {
          window.location.href = redirectTo;
        }
      } catch (error) {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
              ? 'ra.auth.sign_in_error'
              : error.message,
          {
            type: 'warning',
            messageArgs: {
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
      }
    },
    [setLoading, login, redirectTo, notify, onLogin]
  );

  return (
    <Form onSubmit={submit} noValidate defaultValues={{ username: searchParams.get('email') }}>
      <CardContent>
        <TextInput
          source="username"
          label={translate(allowUsername ? 'auth.input.username_or_email' : 'auth.input.email')}
          autoComplete="email"
          fullWidth
          disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          format={value => (value ? value.toLowerCase() : '')}
          validate={allowUsername ? [required()] : [required(), email()]}
        />
        <TextInput
          source="password"
          type="password"
          label={translate('ra.auth.password')}
          autoComplete="current-password"
          fullWidth
          disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          validate={required()}
        />
        <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
          {translate('auth.action.login')}
        </Button>
      </CardContent>
    </Form>
  );
};

LoginForm.defaultValues = {
  allowUsername: false
};

export default LoginForm;
