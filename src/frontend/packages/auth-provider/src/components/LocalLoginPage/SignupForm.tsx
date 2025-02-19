import { useEffect, useState } from 'react';
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
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { Button, CardContent, Typography } from '@mui/material';
import useSignup from '../../hooks/useSignup';
import validatePasswordStrength from './validatePasswordStrength';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { defaultScorer } from '../../passwordScorer';

interface FormValues {
  username: string;
  password: string;
  email: string;
}

interface SignupFormProps {
  onSignup: (redirectTo: string) => void;
  additionalSignupValues: object;
  delayBeforeRedirect: number;
  passwordScorer: typeof defaultScorer;
}

/**
 * @param onSignup Optional function to call when signup is completed. Called after the `delayBeforeRedirect`.
 * @param additionalSignupValues Passed to react-admin's signup function.
 * @param delayBeforeRedirect In milliseconds
 * @param passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
const SignupForm = ({
  passwordScorer = defaultScorer,
  onSignup,
  additionalSignupValues = {},
  delayBeforeRedirect = 0
}: SignupFormProps) => {
  const [searchParams] = useSearchParams();
  const [handleSubmit, setHandleSubmit] = useState<SubmitHandler<FormValues>>(() => {});

  return (
    <Form onSubmit={handleSubmit} noValidate defaultValues={{ email: searchParams.get('email') }}>
      <FormContent
        passwordScorer={passwordScorer}
        additionalSignupValues={additionalSignupValues}
        onSignup={onSignup}
        delayBeforeRedirect={delayBeforeRedirect}
        setHandleSubmit={setHandleSubmit}
      />
    </Form>
  );
};

const FormContent = ({
  passwordScorer = defaultScorer,
  onSignup,
  additionalSignupValues,
  delayBeforeRedirect = 0,
  setHandleSubmit
}: SignupFormProps & { setHandleSubmit: React.Dispatch<React.SetStateAction<SubmitHandler<FormValues>>> }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const signup = useSignup();
  const translate = useTranslate();
  const notify = useNotify();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [locale] = useLocaleState();
  const [password, setPassword] = useState('');
  const formContext = useFormContext();

  useEffect(() => {
    setHandleSubmit(() => async (values: FormValues) => {
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
            type: 'error',
            _: typeof error === 'string' ? error : error?.message ? error.message : undefined
          }
        );
        formContext.reset({ ...values }, { keepDirty: true, keepErrors: true });
      }
    });
  }, [setLoading, signup, additionalSignupValues, redirectTo, notify, onSignup, formContext]);

  return (
    <CardContent>
      <TextInput
        autoFocus
        source="username"
        label={translate('auth.input.username')}
        autoComplete="username"
        fullWidth
        disabled={loading}
        validate={[required(translate('auth.required.identifier')), minLength(2)]}
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
        validate={[required('auth.required.email'), email()]}
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
        onChange={e => {
          setPassword(e.target.value);
        }}
        label={translate('ra.auth.password')}
        autoComplete="new-password"
        fullWidth
        disabled={loading}
        validate={[required('auth.required.password'), validatePasswordStrength(passwordScorer)]}
      />
      <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
        {translate('auth.action.signup')}
      </Button>
    </CardContent>
  );
};

export default SignupForm;
