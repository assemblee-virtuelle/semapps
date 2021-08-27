import * as React from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import { useTranslate, useAuthProvider, useNotify, useSafeSetState } from 'react-admin';
import { useHistory } from 'react-router-dom';
import { Button, CardActions, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
}));

const Input = ({ meta: { touched, error }, input: inputProps, ...props }) => (
  <TextField error={!!(touched && error)} helperText={touched && error} {...inputProps} {...props} fullWidth />
);

const SignupForm = props => {
  const { redirectTo } = props;
  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const classes = useStyles(props);

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
    authProvider
      .signup(values, redirectTo)
      .then(webId => {
        setLoading(false);
        notify('auth.message.new_user_created', 'info');
        history.push('/Person/' + encodeURIComponent(webId) + '/edit');
      })
      .catch(error => {
        setLoading(false);
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
            ? 'ra.auth.sign_in_error'
            : error.message,
          'warning',
          {
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
          }
        );
      });
  };

  return (
    <Form
      onSubmit={submit}
      validate={validate}
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
                id="email"
                name="email"
                component={Input}
                label={translate('auth.input.email')}
                disabled={loading}
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
