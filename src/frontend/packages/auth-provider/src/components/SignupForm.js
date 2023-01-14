import * as React from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import { useTranslate, useNotify, useSafeSetState, useTheme } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Button, CardActions, CircularProgress, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { default as useSignup } from '../hooks/useSignup';

const useStyles = makeStyles(() => { const [theme] = useTheme(); return ({
  form: {
    padding: '0 1em 1em 1em'
  },
  input: {
    marginTop: '1em'
  },
  button: {
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  }
})});

const Input = ({ meta: { touched, error }, input: inputProps, ...props }) => (
  <TextField error={!!(touched && error)} helperText={touched && error} {...inputProps} {...props} fullWidth />
);

const SignupForm = ({ redirectTo, delayBeforeRedirect }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const signup = useSignup();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const validate = values => {
    const errors = { email: undefined, password: undefined };

    if (!values.email) {
      errors.email = translate('ra.validation.required');
    }
    if (!values.password) {
      errors.password = translate('ra.validation.required');
    }
    return errors;
  };

  const submit = values => {
    setLoading(true);
    signup(values)
      .then(webId => {
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
        notify('auth.message.new_user_created', {type: 'info'});
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
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
          }
        );
      });
  };

  return (
    <Form
      onSubmit={submit}
      validate={validate}
      initialValues={{
        name: searchParams.get('name'),
        email: searchParams.get('email')
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.form}>
            <div className={classes.input}>
              <Field
                autoFocus
                id="name"
                name="name"
                component={Input}
                label={translate('auth.input.name')}
                disabled={loading}
              />
            </div>
            <div className={classes.input}>
              <Field
                id="username"
                name="username"
                component={Input}
                label={translate('auth.input.username')}
                disabled={loading}
              />
            </div>
            <div className={classes.input}>
              <Field
                id="email"
                name="email"
                component={Input}
                label={translate('auth.input.email')}
                disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
              />
            </div>
            <div className={classes.input}>
              <Field
                id="password"
                name="password"
                component={Input}
                label={translate('ra.auth.password')}
                type="password"
                disabled={loading}
              />
            </div>
          </div>
          <CardActions>
            <Button variant="contained" type="submit" color="primary" disabled={loading} className={classes.button}>
              {loading && <CircularProgress className={classes.icon} size={18} thickness={2} />}
              {translate('auth.action.signup')}
            </Button>
          </CardActions>
        </form>
      )}
    />
  );
};

SignupForm.propTypes = {
  redirectTo: PropTypes.string
};

export default SignupForm;
