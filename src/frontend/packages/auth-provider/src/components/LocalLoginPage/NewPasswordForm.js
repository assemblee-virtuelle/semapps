import React, { useState } from 'react';
import { Form, useTranslate, useNotify, useSafeSetState, useAuthProvider, TextInput, required } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Button, CardContent, CircularProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import validatePasswordStrength from './validatePasswordStrength';
import { defaultScorer } from '../../passwordScorer';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing(0.3)
  }
}));

const samePassword = (value, allValues) => {
  if (value && value !== allValues.password) {
    return 'Mot de passe différent du premier';
  }
};

/**
 *
 * @param {string} redirectTo
 * @param {Object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
const NewPasswordForm = ({ redirectTo, passwordScorer = defaultScorer }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();

  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();

  const [newPassword, setNewPassword] = useState('');

  const submit = values => {
    setLoading(true);
    authProvider
      .setNewPassword({ ...values, token })
      .then(res => {
        setTimeout(() => {
          window.location.href = `/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`;
          setLoading(false);
        }, 2000);
        notify('auth.notification.password_changed', { type: 'info' });
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
        {passwordScorer && (
          <>
            <Typography variant="caption" style={{ marginBottom: 3 }}>
              {translate('auth.input.password_strength')}:{' '}
            </Typography>

            <PasswordStrengthIndicator password={newPassword} scorer={passwordScorer} sx={{ width: '100%' }} />
          </>
        )}
        <TextInput
          autoFocus
          type="password"
          source="password"
          value={newPassword}
          label={translate('auth.input.new_password')}
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={[required(), validatePasswordStrength(passwordScorer)]}
          onChange={e => setNewPassword(e.target.value)}
        />
        <TextInput
          type="password"
          source="confirm-password"
          label={translate('auth.input.confirm_new_password')}
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={[required(), samePassword]}
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
