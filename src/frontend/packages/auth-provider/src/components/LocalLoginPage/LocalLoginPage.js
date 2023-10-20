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
import { defaultScorer } from '../../passwordScorer';
import getSearchParamsRest from './getSearchParamsRest';

const useStyles = makeStyles(() => ({
  switch: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

/**
 * @param {object} props Props
 * @param {boolean} props.hasSignup If to show signup form.
 * @param {boolean} props.allowUsername Indicates, if login is allowed with username (instead of email).
 * @param {string} props.postSignupRedirect Location to redirect to after signup.
 * @param {string} props.postLoginRedirect Location to redirect to after login.
 * @param {object} props.additionalSignupValues
 * @param {object} props.passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */
const LocalLoginPage = ({
  hasSignup,
  allowUsername,
  postSignupRedirect,
  postLoginRedirect,
  additionalSignupValues,
  passwordScorer = defaultScorer
}) => {
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
      if (postLoginRedirect) {
        navigate(
          `${postLoginRedirect}?redirect=${encodeURIComponent(redirectTo || '/')}${getSearchParamsRest(searchParams)}`
        );
      } else if (redirectTo && redirectTo.startsWith('http')) {
        window.location.href = redirectTo;
      } else {
        navigate(redirectTo || '/');
      }
    }
  }, [identity, isLoading, navigate, searchParams, redirectTo, postLoginRedirect]);

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
  if (isLoading || identity?.id) return null;

  return (
    <SimpleBox title={translate(title)} text={translate(text)} icon={<LockIcon />}>
      <Card>
        {isSignup && (
          <SignupForm
            redirectTo={redirectTo}
            delayBeforeRedirect={4000}
            postSignupRedirect={postSignupRedirect}
            additionalSignupValues={additionalSignupValues}
            passwordScorer={passwordScorer}
          />
        )}
        {isResetPassword && <ResetPasswordForm />}
        {isNewPassword && <NewPasswordForm redirectTo={redirectTo} passwordScorer={passwordScorer} />}
        {isLogin && <LoginForm redirectTo={redirectTo} allowUsername={allowUsername} />}
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
};

LocalLoginPage.defaultProps = {
  hasSignup: true,
  allowUsername: false,
  additionalSignupValues: {}
};

export default LocalLoginPage;
