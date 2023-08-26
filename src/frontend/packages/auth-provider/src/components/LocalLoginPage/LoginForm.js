import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, useTranslate, useNotify, useSafeSetState, TextInput, required, email, useLogin } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Button, CardContent, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  content: {
    width: 450
  },
  icon: {
    margin: theme.spacing(0.3)
  }
}));

const LoginForm = ({ redirectTo }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const submit = values => {
    setLoading(true);
    login(values, redirectTo)
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
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
          source="username"
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

LoginForm.propTypes = {
  redirectTo: PropTypes.string
};

export default LoginForm;
