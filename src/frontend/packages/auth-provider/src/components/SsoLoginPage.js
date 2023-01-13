import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useLogin, useNotify, useDataProvider, useAuthProvider, Notification, useTheme } from 'react-admin';
import { StyledEngineProvider } from '@mui/material';
import { styled, ThemeProvider } from '@mui/system';
import { Avatar, Button, Card, CardActions, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useLocation, useNavigate } from 'react-router-dom';

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const StyledMain = styled('main')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: theme.palette.grey['300']
}));

const StyledText = styled('main')(({ theme }) => ({
  maxWidth: 300,
  textAlign: 'center',
  padding: '4px 8px 8px'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  marginTop: '6em'
}));

const LockIconAvatar = styled('div')(({ theme }) => ({
  margin: '1em',
  display: 'flex',
  justifyContent: 'center'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.grey['500']
}));

const SsoLoginPage = ({ buttons, userResource, propertiesExist, text }) => {

  const notify = useNotify();
  const login = useLogin();
  const dataProvider = useDataProvider();
  const authProvider = useAuthProvider();
  const [theme] = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {

      const searchParams = new URLSearchParams(location.search);

      if (searchParams.has('login')) {
        if (searchParams.has('error')) {
          if (searchParams.get('error') === 'registration.not-allowed') {
            notify('auth.message.user_email_not_found', 'error');
          } else {
            notify('auth.message.bad_request', 'error', { error: searchParams.get('error') });
          }
        } else if (searchParams.has('token')) {
          const token = searchParams.get('token');
          const { webId } = jwtDecode(token);

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
            notify('auth.message.user_not_allowed_to_login', 'error');
            navigate.replace('/login');
          } else {
            localStorage.setItem('token', token);
            if (searchParams.has('redirect')) {
              notify('auth.message.user_connected', 'info');
              navigate(searchParams.get('redirect'));
            } else if (searchParams.has('new') && searchParams.get('new') === 'true') {
              notify('auth.message.new_user_created', 'info');
              navigate('/' + userResource + '/' + encodeURIComponent(webId) + '/edit');
            } else {
              notify('auth.message.user_connected', 'info');
              navigate('/');
            }
          }
        }
      }

      if (searchParams.has('logout')) {
        localStorage.removeItem('token');
        notify('auth.message.user_disconnected', 'info');
        navigate('/');
      }
    })();
  }, [location.search]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StyledMain>
          <StyledCard>
            <LockIconAvatar>
              <StyledAvatar>
                <LockIcon />
              </StyledAvatar>
            </LockIconAvatar>
            {text && (
              <Typography variant="body2" /*className={classes.text}*/>
                {text}
              </Typography>
            )}
            {buttons &&
              buttons.map((button, i) => (
                <CardActions key={i}>
                  {React.cloneElement(button, {
                    fullWidth: true,
                    variant: 'outlined',
                    type: 'submit',
                    onClick: () => login({}, '/login')
                  })}
                </CardActions>
              ))}
          </StyledCard>
        </StyledMain>
        <Notification />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

SsoLoginPage.defaultProps = {
  propertiesExist: [],
  // TODO deprecate this
  buttons: [<Button startIcon={<Avatar src="/lescommuns.jpg" />}>Les Communs</Button>],
  userResource: 'Person'
};

export default SsoLoginPage;
