import { useForm, FormProvider } from 'react-hook-form';
import { useTranslate, useNotify, useSafeSetState, useLogin, email } from 'react-admin';
import { useSearchParams } from 'react-router-dom';
import { Button, CardContent, TextField } from '@mui/material';

const LoginForm = ({ onLogin, allowUsername }) => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const methods = useForm({
    defaultValues: {
      username: searchParams.get('email') || '',
      password: ''
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = methods;

  const onSubmit = async values => {
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
      // Reset form to current values to ensure consistency
      reset(values, { keepValues: true });
      notify(
        typeof error === 'string'
          ? error
          : typeof error === 'undefined' || !error.message
            ? 'ra.auth.sign_in_error'
            : error.message,
        {
          type: 'warning',
          messageArgs: {
            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
          }
        }
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <TextField
            {...register('username', {
              required: translate('ra.validation.required'),
              validate: value => {
                if (!allowUsername) {
                  const validationRes = email()(value);
                  return validationRes.message ?? validationRes ?? true;
                }
                return true;
              },
              setValueAs: value => value.toLowerCase()
            })}
            label={translate(allowUsername ? 'auth.input.username_or_email' : 'auth.input.email')}
            error={!!errors.username}
            helperText={translate(errors.username?.message)}
            autoComplete="email"
            fullWidth
            disabled={loading}
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            {...register('password', {
              required: translate('ra.validation.required')
            })}
            type="password"
            label={translate('ra.auth.password')}
            error={!!errors.password}
            helperText={translate(errors.password?.message)}
            autoComplete="current-password"
            fullWidth
            disabled={loading}
            margin="dense"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={loading || isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          >
            {translate('auth.action.login')}
          </Button>
        </CardContent>
      </form>
    </FormProvider>
  );
};

LoginForm.defaultValues = {
  allowUsername: false
};

export default LoginForm;
