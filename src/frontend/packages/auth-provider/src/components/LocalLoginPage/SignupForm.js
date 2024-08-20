import React, { useCallback, useState } from 'react';
import createSlug from 'speakingurl';
import {
  Form,
  useTranslate,
  useNotify,
  useSafeSetState,
  TextInput,
  minLength,
  required,
  email,
  useLocaleState
} from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent, CircularProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useSignup from '../../hooks/useSignup';
import validatePasswordStrength from './validatePasswordStrength';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { defaultScorer } from '../../passwordScorer';

const useStyles = makeStyles(theme => ({
  content: {
    width: 450
  },
  icon: {
    margin: theme.spacing(0.3)
  }
}));

/**
 * @param {function} props.onSignup Optional function to call when signup is completed
 * @param {object} props.additionalSignupValues
 * @param {number} delayBeforeRedirect
 * @param {object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
const SignupForm = ({ passwordScorer = defaultScorer, onSignup, additionalSignupValues, delayBeforeRedirect = 0 }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const signup = useSignup();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [locale] = useLocaleState();
  const [password, setPassword] = useState('');

  const submit = useCallback(
    async values => {
      try {
        setLoading(true);
        await signup({
          ...values,
          ...additionalSignupValues
        });
        setTimeout(() => {
          if (onSignup) {
            onSignup(redirectTo);
          } else {
            window.location.href = redirectTo;
          }
        }, delayBeforeRedirect);
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
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
          }
        );
      }
    },
    [setLoading, signup, additionalSignupValues, redirectTo, notify, onSignup]
  );

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
          validate={[required(), minLength(2)]}
          format={value =>
            value
              ? createSlug(value, {
                  lang: locale || 'fr',
                  separator: '_',
                  custom: ['.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                })
              : ''
          }
        />
        <TextInput
          source="email"
          label={translate('auth.input.email')}
          autoComplete="email"
          fullWidth
          disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          validate={[required(), email()]}
        />
        {passwordScorer && password && !(searchParams.has('email') && searchParams.has('force-email')) && (
          <>
            <Typography variant="caption" style={{ marginBottom: 3 }}>
              {translate('auth.input.password_strength')}:{' '}
            </Typography>
            <PasswordStrengthIndicator password={password} scorer={passwordScorer} sx={{ width: '100%' }} />
          </>
        )}
        <TextInput
          source="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          label={translate('ra.auth.password')}
          autoComplete="new-password"
          fullWidth
          disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          validate={[required(), validatePasswordStrength(passwordScorer)]}
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

SignupForm.defaultValues = {
  redirectTo: '/',
  additionalSignupValues: {}
};

export default SignupForm;
