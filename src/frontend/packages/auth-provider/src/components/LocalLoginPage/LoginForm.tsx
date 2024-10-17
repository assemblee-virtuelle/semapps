import { useEffect, useState } from 'react';
import { useTranslate, useNotify, useSafeSetState, TextInput, required, email, useLogin, Form } from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent } from '@mui/material';
import { SubmitHandler, useFormContext } from 'react-hook-form';

interface FormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  /**
   * Called on login.
   * @param {string} redirectTo The location the form asks to redirect to, if set in search param `redirect`.
   */
  onLogin: (redirectTo: string) => void;
  /** If the form should allow login with username (in addition to email). */
  allowUsername: boolean;
}
const LoginForm = ({ onLogin, allowUsername }: LoginFormProps) => {
  const [searchParams] = useSearchParams();
  const [handleSubmit, setHandleSubmit] = useState<SubmitHandler<FormValues>>(() => {});

  return (
    <Form onSubmit={handleSubmit} noValidate defaultValues={{ email: searchParams.get('email') }}>
      <FormContent onLogin={onLogin} allowUsername={allowUsername} setHandleSubmit={setHandleSubmit} />
    </Form>
  );
};

const FormContent = ({
  onLogin,
  allowUsername,
  setHandleSubmit
}: LoginFormProps & { setHandleSubmit: React.Dispatch<React.SetStateAction<SubmitHandler<FormValues>>> }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const formContext = useFormContext();

  useEffect(() => {
    setHandleSubmit(() => async (values: FormValues) => {
      try {
        setLoading(true);
        await login(values);
        if (onLogin) {
          onLogin(redirectTo);
        } else {
          window.location.href = redirectTo;
        }
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
            messageArgs: {
              _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
            }
          }
        );
        formContext.reset({ ...values }, { keepDirty: true, keepErrors: true });
      }
    });
  }, [setLoading, login, redirectTo, notify, onLogin]);

  return (
    <CardContent>
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
        disabled={loading}
        validate={required()}
      />
      <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
        {translate('auth.action.login')}
      </Button>
    </CardContent>
  );
};

LoginForm.defaultValues = {
  allowUsername: false
};

export default LoginForm;
