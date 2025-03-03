import React, { useEffect, useState } from 'react';
import { Form, TextInput, required, useTranslate, useNotify, useSafeSetState, useAuthProvider } from 'react-admin';
import { Button, CardContent } from '@mui/material';
import { SubmitHandler } from 'react-hook-form';
import RequiredFieldIndicator from './RequiredFieldIndicator';

interface FormValues {
  email: string;
}

const ResetPasswordForm = () => {
  const [handleSubmit, setHandleSubmit] = useState<SubmitHandler<FormValues>>(() => {});

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormContent setHandleSubmit={setHandleSubmit} />
    </Form>
  );
};

const FormContent = ({
  setHandleSubmit
}: {
  setHandleSubmit: React.Dispatch<React.SetStateAction<SubmitHandler<FormValues>>>;
}) => {
  const [loading, setLoading] = useSafeSetState(false);
  const authProvider = useAuthProvider();
  const translate = useTranslate();
  const notify = useNotify();

  useEffect(() => {
    setHandleSubmit(() => async (values: FormValues) => {
      setLoading(true);
      authProvider
        .resetPassword({ ...values })
        .then(() => {
          setLoading(false);
          notify('auth.notification.reset_password_submitted', { type: 'info' });
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
        validate={required(translate('auth.required.email'))}
        format={value => (value ? value.toLowerCase() : '')}
      />
      <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
        {translate('auth.action.submit')}
      </Button>
    </CardContent>
  );
};

export default ResetPasswordForm;
