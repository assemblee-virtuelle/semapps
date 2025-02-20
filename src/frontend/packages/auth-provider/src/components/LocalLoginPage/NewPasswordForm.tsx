import React, { useEffect, useState } from 'react';
import { Form, useTranslate, useNotify, useSafeSetState, useAuthProvider, TextInput, required } from 'react-admin';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button, CardContent, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SubmitHandler } from 'react-hook-form';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import validatePasswordStrength from './validatePasswordStrength';
import { defaultScorer } from '../../passwordScorer';
import RequiredFieldIndicator, { VisuallyHidden } from './RequiredFieldIndicator';

interface FormProps {
  redirectTo: string;
  passwordScorer: typeof defaultScorer;
}

interface FormValues {
  email: string;
  password: string;
  'confirm-password': string;
}

const samePassword = (value: string, allValues: FormValues) => {
  if (value && value !== allValues.password) {
    return 'auth.input.password_mismatch';
  }
};

/**
 *
 * @param {string} redirectTo
 * @param {typeof defaultScorer} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
const NewPasswordForm = ({ redirectTo, passwordScorer = defaultScorer }: FormProps) => {
  const [searchParams] = useSearchParams();
  const [handleSubmit, setHandleSubmit] = useState<SubmitHandler<FormValues>>(() => {});

  return (
    <Form onSubmit={handleSubmit} noValidate defaultValues={{ email: searchParams.get('email') }}>
      <FormContent setHandleSubmit={setHandleSubmit} redirectTo={redirectTo} passwordScorer={passwordScorer} />
    </Form>
  );
};

const FormContent = ({
  setHandleSubmit,
  redirectTo,
  passwordScorer
}: FormProps & {
  setHandleSubmit: React.Dispatch<React.SetStateAction<SubmitHandler<FormValues>>>;
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [loading, setLoading] = useSafeSetState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const authProvider = useAuthProvider();

  const translate = useTranslate();
  const notify = useNotify();

  const [newPassword, setNewPassword] = useState('');

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    setHandleSubmit(() => async (values: FormValues) => {
      setLoading(true);
      authProvider
        .setNewPassword({ ...values, token })
        .then(() => {
          setTimeout(() => {
            const url = new URL('/login', window.location.origin);
            if (redirectTo) url.searchParams.append('redirect', redirectTo);
            url.searchParams.append('email', values.email);
            window.location.href = url.toString();
            setLoading(false);
          }, 2000);
          notify('auth.notification.password_changed', { type: 'info' });
        })
        .catch((error: Error) => {
          setLoading(false);
          notify(
            typeof error === 'string'
              ? error
              : !error.message
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
    });
  });

  return (
    <CardContent>
      <TextInput
        autoFocus
        source="email"
        label={
          <>
            {translate('auth.input.email')}
            <RequiredFieldIndicator />
          </>
        }
        autoComplete="email"
        fullWidth
        disabled={loading}
        validate={required(translate('auth.required.newPassword'))}
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
      <div className="password-container" style={{ position: 'relative' }}>
        <TextInput
          autoFocus
          type={showNewPassword ? 'text' : 'password'}
          source="password"
          value={newPassword}
          label={
            <>
              {translate('auth.input.new_password')}
              <RequiredFieldIndicator />
            </>
          }
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={[required(translate('auth.required.newPasswordAgain')), validatePasswordStrength(passwordScorer)]}
          onChange={e => {
            setNewPassword(e.target.value);
          }}
          aria-describedby="new-password-desc"
        />
        <VisuallyHidden id="new-password-desc">{translate('auth.input.password_description')}</VisuallyHidden>
        <IconButton
          aria-label={translate(showNewPassword ? 'auth.action.hide_password' : 'auth.action.show_password')}
          onClick={toggleNewPassword}
          style={{
            position: 'absolute',
            right: '8px',
            top: '17px',
            padding: '4px'
          }}
          size="large"
        >
          {showNewPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
      <div className="password-container" style={{ position: 'relative' }}>
        <TextInput
          type={showConfirmPassword ? 'text' : 'password'}
          source="confirm-password"
          label={
            <>
              {translate('auth.input.confirm_new_password')}
              <RequiredFieldIndicator />
            </>
          }
          autoComplete="current-password"
          fullWidth
          disabled={loading}
          validate={[required(), samePassword]}
          aria-describedby="confirm-password-desc"
        />
        <VisuallyHidden id="confirm-password-desc">{translate('auth.input.password_description')}</VisuallyHidden>
        <IconButton
          aria-label={translate(showConfirmPassword ? 'auth.action.hide_password' : 'auth.action.show_password')}
          onClick={toggleConfirmPassword}
          style={{
            position: 'absolute',
            right: '8px',
            top: '17px',
            padding: '4px'
          }}
          size="large"
        >
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
      <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
        {translate('auth.action.set_new_password')}
      </Button>
    </CardContent>
  );
};

export default NewPasswordForm;
