import React from 'react';
import { useRef, useEffect } from 'react';
import { Card, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm, useTranslate, useGetIdentity } from 'react-admin';
import SignupForm from './SignupForm';

// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const LocalLoginPage = (props) => {
    const { children, backgroundImage, ...rest } = props;
    const containerRef = useRef();
    let backgroundImageLoaded = false;
    const navigate = useNavigate();
    const translate = useTranslate();
    const [searchParams] = useSearchParams();
    const isSignup = searchParams.has('signup');
    const redirectTo = searchParams.get('redirect');
    const { identity, isLoading } = useGetIdentity();

    useEffect(() => {
      if (!isLoading && identity?.id) {
        // Already authenticated, redirect to the home page
        navigate(redirectTo || '/');
      }    
    }, [identity, isLoading, navigate, redirectTo]);

    const updateBackgroundImage = () => {
        if (!backgroundImageLoaded && containerRef.current) {
            containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
            backgroundImageLoaded = true;
        }
    };

    // Load background image asynchronously to speed up time to interactive
    const lazyLoadBackgroundImage = () => {
        if (backgroundImage) {
            const img = new Image();
            img.onload = updateBackgroundImage;
            img.src = backgroundImage;
        }
    };

    useEffect(() => {
        if (!backgroundImageLoaded) {
            lazyLoadBackgroundImage();
        }
    });

    if (isLoading) return null;

    return (
      <Root {...rest} ref={containerRef}>
          <Card className={LocalLoginPageClasses.card}>
              <div className={LocalLoginPageClasses.avatar}>
                  <Avatar className={LocalLoginPageClasses.icon}>
                      <LockIcon />
                  </Avatar>
              </div>
              {isSignup ? (
                <SignupForm redirectTo={redirectTo} delayBeforeRedirect={3000} />
              ) : (
                <LoginForm redirectTo={redirectTo} />
              )}
              <div className={LocalLoginPageClasses.switch}>
                {isSignup ? (
                  <Link to="/login">
                    <Typography variant="body2">{translate('auth.action.login')}</Typography>
                  </Link>
                ) : (
                  <Link to="/login?signup=true">
                    <Typography variant="body2">{translate('auth.action.signup')}</Typography>
                  </Link>
                )}
              </div> 
          </Card>
      </Root>
    );
};

const PREFIX = 'LocalLoginPage';

export const LocalLoginPageClasses = {
    card: `${PREFIX}-card`,
    avatar: `${PREFIX}-avatar`,
    icon: `${PREFIX}-icon`,
    switch: `${PREFIX}-switch`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
    [`& .${LocalLoginPageClasses.card}`]: {
        minWidth: 300,
        marginTop: '6em',
    },
    [`& .${LocalLoginPageClasses.avatar}`]: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    [`& .${LocalLoginPageClasses.icon}`]: {
        backgroundColor: theme.palette.secondary[500],
    },
    [`& .${LocalLoginPageClasses.switch}`]: {
      marginBottom: '1em',
      display: 'flex',
      justifyContent: 'center'
  },
}));

export default LocalLoginPage;
