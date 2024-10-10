import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import createSlug from 'speakingurl';
import { useTranslate, useNotify, useSafeSetState, useLocaleState } from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent, TextField, Typography } from '@mui/material';
import useSignup from '../../hooks/useSignup';
import validatePasswordStrength from './validatePasswordStrength';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { defaultScorer } from '../../passwordScorer';

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
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [locale] = useLocaleState();

  const methods = useForm({
    defaultValues: {
      username: '',
      email: searchParams.get('email') || '',
      password: ''
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = methods;

  const password = watch('password');

  const onSubmit = async values => {
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
      // Reset form to current values to ensure consistency...
      reset(values, { keepValues: true });
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
  };

  const formatUsername = value => {
    return value
      ? createSlug(value, {
          lang: locale || 'fr',
          separator: '_',
          custom: ['.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        })
      : '';
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <TextField
            {...register('username', {
              required: translate('ra.validation.required'),
              minLength: {
                value: 2,
                message: translate('ra.validation.minLength', { min: 2 })
              },
              setValueAs: formatUsername
            })}
            label={translate('auth.input.username')}
            error={!!errors.username}
            helperText={translate(errors.username?.message)}
            fullWidth
            disabled={loading}
            margin="normal"
          />

          <TextField
            {...register('email', {
              required: translate('ra.validation.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: translate('ra.validation.email')
              }
            })}
            label={translate('auth.input.email')}
            error={!!errors.email}
            autoComplete="email"
            helperText={translate(errors.email?.message)}
            fullWidth
            disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          />

          {passwordScorer && password && !(searchParams.has('email') && searchParams.has('force-email')) && (
            <>
              <Typography variant="caption" style={{ marginBottom: 3 }}>
                {translate('auth.input.password_strength')}:{' '}
              </Typography>
              <PasswordStrengthIndicator password={password} scorer={passwordScorer} sx={{ width: '100%' }} />
            </>
          )}

          <TextField
            {...register('password', {
              required: translate('ra.validation.required'),
              validate: value => validatePasswordStrength(passwordScorer)(value)
            })}
            type="password"
            value={password}
            label={translate('ra.auth.password')}
            error={!!errors.password}
            helperText={translate(errors.password?.message)}
            autoComplete="new-password"
            fullWidth
            disabled={loading || (searchParams.has('email') && searchParams.has('force-email'))}
          />

          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={loading || isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          >
            {translate('auth.action.signup')}
          </Button>
        </CardContent>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
