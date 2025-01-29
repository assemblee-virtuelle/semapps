import React, { useRef, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataProvider, useAuthProvider, useLogin, useGetIdentity, useNotify } from 'react-admin';
import { Card, Avatar, Typography, Button, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';

const delay = async t => new Promise(resolve => setTimeout(resolve, t));

// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const SsoLoginPage = ({
  children,
  backgroundImage,
  buttons,
  userResource = 'Person',
  propertiesExist = [],
  text,
  ...rest
}) => {
  const containerRef = useRef();
  let backgroundImageLoaded = false;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: identity, isLoading } = useGetIdentity();

  const notify = useNotify();
  const login = useLogin();
  const dataProvider = useDataProvider();
  const authProvider = useAuthProvider();

  useEffect(() => {
    if (!isLoading && identity?.id) {
      // Already authenticated, redirect to the home page
      navigate(searchParams.get('redirect') || '/');
    }
  }, [identity, isLoading, navigate, searchParams]);

  useEffect(() => {
    (async () => {
      if (searchParams.has('login')) {
        if (searchParams.has('error')) {
          if (searchParams.get('error') === 'registration.not-allowed') {
            notify('auth.message.user_email_not_found', { type: 'error' });
          } else {
            notify('auth.message.bad_request', { type: 'error', messageArgs: { error: searchParams.get('error') } });
          }
        } else if (searchParams.has('token')) {
          const token = searchParams.get('token');
          const { webId } = jwtDecode(token);

          localStorage.setItem('token', token);

          let userData;
          ({ data: userData } = await dataProvider.getOne(userResource, { id: webId }));

          if (propertiesExist.length > 0) {
            let allPropertiesExist = propertiesExist.every(p => userData[p]);
            while (!allPropertiesExist) {
              console.log('Waiting for all properties to have been created', propertiesExist);
              await delay(500);
              ({ data: userData } = await dataProvider.getOne(userResource, { id: webId }));
              allPropertiesExist = propertiesExist.every(p => userData[p]);
            }
          }

          if (!authProvider.checkUser(userData)) {
            localStorage.removeItem('token');
            notify('auth.message.user_not_allowed_to_login', { type: 'error' });
            navigate.replace('/login');
          } else if (searchParams.has('redirect')) {
            notify('auth.message.user_connected', { type: 'info' });
            window.location.href = searchParams.get('redirect');
          } else if (searchParams.has('new') && searchParams.get('new') === 'true') {
            notify('auth.message.new_user_created', { type: 'info' });
            window.location.href = `/${userResource}/${encodeURIComponent(webId)}`;
          } else {
            notify('auth.message.user_connected', { type: 'info' });
            window.location.href = '/';
          }
        }
      }

      if (searchParams.has('logout')) {
        // Delete token and any other value in local storage
        localStorage.clear();
        notify('auth.message.user_disconnected', { type: 'info' });
        navigate('/');
      }
    })();
  }, [searchParams, navigate, notify, userResource]);

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
      <Card className={SsoLoginPageClasses.card}>
        <div className={SsoLoginPageClasses.avatar}>
          <Avatar className={SsoLoginPageClasses.icon}>
            <LockIcon />
          </Avatar>
        </div>
        {text && <Typography variant="body2" /* className={classes.text} */>{text}</Typography>}
        {buttons?.map((button, i) => (
          <CardActions key={i}>
            {React.cloneElement(button, {
              fullWidth: true,
              variant: 'outlined',
              type: 'submit',
              onClick: () => login({}, '/login')
            })}
          </CardActions>
        ))}
      </Card>
    </Root>
  );
};

const PREFIX = 'SsoLoginPage';

export const SsoLoginPageClasses = {
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
  icon: `${PREFIX}-icon`,
  switch: `${PREFIX}-switch`
};

const Root = styled('div', {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root
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
  [`& .${SsoLoginPageClasses.card}`]: {
    minWidth: 300,
    marginTop: '6em'
  },
  [`& .${SsoLoginPageClasses.avatar}`]: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center'
  },
  [`& .${SsoLoginPageClasses.icon}`]: {
    backgroundColor: theme.palette.secondary[500]
  },
  [`& .${SsoLoginPageClasses.switch}`]: {
    marginBottom: '1em',
    display: 'flex',
    justifyContent: 'center'
  }
}));

export default SsoLoginPage;
