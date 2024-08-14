import { useEffect, useMemo } from 'react';
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
import useLoginCompleted from '../../hooks/useLoginCompleted';
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
  const loginCompleted = useLoginCompleted();
  const redirectTo = postLoginRedirect
    ? `${postLoginRedirect}?${getSearchParamsRest(searchParams)}`
    : searchParams.get('redirect') || '/';
  const interactionId = searchParams.get('interaction_id');
  const { data: identity, isLoading } = useGetIdentity();

  useEffect(() => {
    (async () => {
      if (!isLoading && identity?.id) {
        // If interactionId is set, it means we are connecting from another application
        // So call a custom endpoint to tell the OIDC server the login is completed
        if (interactionId) await loginCompleted(interactionId);
        window.location.href = redirectTo;
      }
    })();
  }, [identity, isLoading, navigate, searchParams, redirectTo, loginCompleted, interactionId]);

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
        {isSignup && (
          <SignupForm
            delayBeforeRedirect={4000}
            postSignupRedirect={postSignupRedirect}
            additionalSignupValues={additionalSignupValues}
            passwordScorer={passwordScorer}
          />
        )}
        {isResetPassword && <ResetPasswordForm />}
        {isNewPassword && <NewPasswordForm redirectTo={redirectTo} passwordScorer={passwordScorer} />}
        {isLogin && <LoginForm postLoginRedirect={postLoginRedirect} allowUsername={allowUsername} />}
        <div className={classes.switch}>
          {(isSignup || isResetPassword) && (
            <Link to={`/login?${getSearchParamsRest(searchParams)}`}>
              <Typography variant="body2">{translate('auth.action.login')}</Typography>
            </Link>
          )}
          {isLogin && (
            <>
              {hasSignup && (
                <div>
                  <Link to={`/login?signup=true&${getSearchParamsRest(searchParams)}`}>
                    <Typography variant="body2">{translate('auth.action.signup')}</Typography>
                  </Link>
                </div>
              )}
              <div>
                <Link to={`/login?reset_password=true&${getSearchParamsRest(searchParams)}`}>
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
