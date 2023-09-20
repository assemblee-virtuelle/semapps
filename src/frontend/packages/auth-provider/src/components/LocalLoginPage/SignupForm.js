import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, useTranslate, useNotify, useSafeSetState, TextInput, required, email } from 'react-admin';
import useSignup from '../../hooks/useSignup';
import { useLocation } from 'react-router-dom';
import { Button, CardContent, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  content: {
    width: 450,
  },
  icon: {
    margin: theme.spacing(0.3),
  },
}));

const SignupForm = ({ redirectTo, delayBeforeRedirect }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const signup = useSignup();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const submit = (values) => {
    setLoading(true);
    signup(values)
      .then((webId) => {
        if (delayBeforeRedirect) {
          setTimeout(() => {
            // Reload to ensure the dataServer config is reset
            window.location.reload();
            window.location.href = redirectTo || '/';
            setLoading(false);
          }, delayBeforeRedirect);
        } else {
          // Reload to ensure the dataServer config is reset
          window.location.reload();
          window.location.href = redirectTo || '/';
          setLoading(false);
        }
        notify('auth.message.new_user_created', { type: 'info' });
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
            ? 'ra.auth.sign_in_error'
            : error.message,
          {
            type: 'warning',
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined,
          },
        );
      });
  };

  return (
    <Form onSubmit={submit} noValidate defaultValues={{ email: searchParams.get('email') }}>
      <CardContent className={classes.content}>
        <TextInput
          autoFocus
          source="username"
          label={translate('auth.input.username')}
          autoComplete="username"
          fullWidth
          disabled={loading}
          validate={required()}
        />
        <TextInput
          source="email"
          label={translate('auth.input.email')}
          autoComplete="email"
          fullWidth
          disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          validate={[required(), email()]}
        />
        <TextInput
          source="password"
          type="password"
          label={translate('ra.auth.password')}
          autoComplete="new-password"
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
            translate('auth.action.signup')
          )}
        </Button>
      </CardContent>
    </Form>
  );
};

SignupForm.propTypes = {
  redirectTo: PropTypes.string,
};

export default SignupForm;
