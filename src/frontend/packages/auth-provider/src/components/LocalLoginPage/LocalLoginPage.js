import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslate, useGetIdentity } from 'react-admin';
import { Card, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import makeStyles from '@mui/styles/makeStyles';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import NewPasswordForm from './NewPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import SimpleBox from './SimpleBox';

const useStyles = makeStyles(() => ({
  switch: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

/**
 *
 */
function LocalLoginPage({ hasSignup }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const translate = useTranslate();
  const [searchParams] = useSearchParams();
  const isSignup = hasSignup && searchParams.has('signup');
  const isResetPassword = searchParams.has('reset_password');
  const isNewPassword = searchParams.has('new_password');
  const isLogin = !isSignup && !isResetPassword && !isNewPassword;
  const redirectTo = searchParams.get('redirect');
  const { identity, isLoading } = useGetIdentity();

  useEffect(() => {
    if (!isLoading && identity?.id) {
      // Already authenticated, redirect to the home page
      if (redirectTo?.startsWith('http')) {
        window.location.href = redirectTo;
      } else {
        navigate(redirectTo || '/');
      }
    }
  }, [identity, isLoading, navigate, redirectTo]);

  const [title, text] = useMemo(() => {
    if (isSignup) {
      return ['auth.action.signup', 'auth.helper.signup'];
    }
    if (isLogin) {
      return ['auth.action.login', 'auth.helper.login'];
    }
    if (isResetPassword) {
      return ['auth.action.reset_password', 'auth.helper.reset_password'];
    }
    if (isNewPassword) {
      return ['auth.action.set_new_password', 'auth.helper.set_new_password'];
    }
  }, [isSignup, isLogin, isResetPassword, isNewPassword]);

  if (isLoading || identity?.id) return null;

  return (
    <SimpleBox title={translate(title)} text={translate(text)} icon={<LockIcon />}>
      <Card>
        {isSignup && <SignupForm redirectTo={redirectTo} delayBeforeRedirect={3000} />}
        {isResetPassword && <ResetPasswordForm />}
        {isNewPassword && <NewPasswordForm redirectTo={redirectTo} />}
        {isLogin && <LoginForm redirectTo={redirectTo} />}
        <div className={classes.switch}>
          {isSignup && (
            <Link to="/login">
              <Typography variant="body2">{translate('auth.action.login')}</Typography>
            </Link>
          )}
          {isLogin && (
            <>
              {hasSignup && (
                <div>
                  <Link to="/login?signup=true">
                    <Typography variant="body2">{translate('auth.action.signup')}</Typography>
                  </Link>
                </div>
              )}
              <div>
                <Link to={`/login?reset_password=true&${searchParams.toString()}`}>
                  <Typography variant="body2">{translate('auth.action.reset_password')}</Typography>
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </SimpleBox>
  );
}

LocalLoginPage.defaultProps = {
  hasSignup: true
};

export default LocalLoginPage;
