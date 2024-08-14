import React, { useCallback } from 'react';
import {
  Form,
  useTranslate,
  useNotify,
  useSafeSetState,
  TextInput,
  required,
  email,
  useLogin,
  useDataProvider
} from 'react-admin';
import useLoginCompleted from '../../hooks/useLoginCompleted';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import getSearchParamsRest from './getSearchParamsRest';

const useStyles = makeStyles(theme => ({
  content: {
    width: 450
  },
  icon: {
    margin: theme.spacing(0.3)
  }
}));

const LoginForm = ({ postLoginRedirect, allowUsername }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [searchParams] = useSearchParams();
  const loginCompleted = useLoginCompleted();
  const interactionId = searchParams.get('interaction_id');
  const redirectTo = postLoginRedirect
    ? `${postLoginRedirect}?${getSearchParamsRest(searchParams)}`
    : searchParams.get('redirect');

  const submit = useCallback(
    async values => {
      try {
        setLoading(true);
        await login(values);
        // If interactionId is set, it means we are connecting from another application.
        // So call a custom endpoint to tell the OIDC server the login is completed
        if (interactionId) await loginCompleted(interactionId);
        setLoading(false);
        // TODO now that we have the refreshConfig method, see if we can avoid a hard reload
        // window.location.reload();
        window.location.href = redirectTo;
      } catch (e) {
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
    [setLoading, login, redirectTo, notify, interactionId, dataProvider]
  );

  return (
    <Form onSubmit={submit} noValidate defaultValues={{ username: searchParams.get('email') }}>
      <CardContent className={classes.content}>
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
            translate('auth.action.login')
          )}
        </Button>
      </CardContent>
    </Form>
  );
};

LoginForm.defaultValues = {
  redirectTo: '/',
  allowUsername: false
};

export default LoginForm;
