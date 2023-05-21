import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useLogin, useNotify, useDataProvider, useAuthProvider, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Card, CardActions, Typography } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.grey['300']
  },
  text: {
    maxWidth: 300,
    textAlign: 'center',
    padding: '4px 8px 8px'
  },
  card: {
    minWidth: 300,
    marginTop: '6em'
  },
  lockIconAvatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center'
  },
  lockIcon: {
    backgroundColor: theme.palette.grey['500']
  }
}));

const SsoLoginPage = ({ theme, history, location, buttons, userResource, propertiesExist, text }) => {
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const dataProvider = useDataProvider();
  const authProvider = useAuthProvider();

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
            notify('auth.message.user_not_allowed_to_login', 'error');
            history.replace('/login');
          } else {
            if (searchParams.has('redirect')) {
              notify('auth.message.user_connected', 'info');
              history.push(searchParams.get('redirect'));
            } else if (searchParams.has('new') && searchParams.get('new') === 'true') {
              notify('auth.message.new_user_created', 'info');
              history.push('/' + userResource + '/' + encodeURIComponent(webId));
            } else {
              notify('auth.message.user_connected', 'info');
              history.push('/');
            }
          }
        }
      }

      if (searchParams.has('logout')) {
        // Delete token and any other value in local storage
        localStorage.clear();
        notify('auth.message.user_disconnected', 'info');
        history.push('/');
      }
    })();
  }, [location.search]);

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <div className={classes.main}>
        <Card className={classes.card}>
          <div className={classes.lockIconAvatar}>
            <Avatar className={classes.lockIcon}>
              <LockIcon />
            </Avatar>
          </div>
          {text && (
            <Typography variant="body2" className={classes.text}>
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
        </Card>
      </div>
      <Notification />
    </ThemeProvider>
  );
};

SsoLoginPage.defaultProps = {
  propertiesExist: [],
  // TODO deprecate this
  buttons: [<Button startIcon={<Avatar src="/lescommuns.jpg" />}>Les Communs</Button>],
  userResource: 'Person'
};

export default SsoLoginPage;
