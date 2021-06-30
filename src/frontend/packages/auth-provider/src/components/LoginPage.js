import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useLogin, useNotify, useDataProvider, useAuthProvider, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Card, CardActions } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary[500]
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
    backgroundColor: theme.palette.secondary[500]
  }
}));

const LoginPage = ({ theme, history, location, buttons, userResource }) => {
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
          const { data } = await dataProvider.getOne('Person', { id: webId });

          if (!authProvider.checkUser(data)) {
            notify('auth.message.user_not_allowed_to_login', 'error');
            history.replace('/login');
          } else {
            localStorage.setItem('token', token);
            if (searchParams.has('new') && searchParams.get('new') === 'true') {
              notify('auth.message.new_user_created', 'info');
              history.push('/' + userResource + '/' + encodeURIComponent(webId) + '/edit');
            } else {
              notify('auth.message.user_connected', 'info');
              history.push('/');
            }
          }
        }
      }

      if (searchParams.has('logout')) {
        localStorage.removeItem('token');
        notify('auth.message.user_disconnected', 'info');
        history.push('/');
      }
    })();
  }, [location.search]);

  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <div className={classes.main}>
        <Card className={classes.card}>
          <div className={classes.lockIconAvatar}>
            <Avatar className={classes.lockIcon}>
              <LockIcon />
            </Avatar>
          </div>
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

// TODO deprecate this
LoginPage.defaultProps = {
  buttons: [<Button startIcon={<Avatar src="/lescommuns.jpg" />}>Les Communs</Button>],
  userResource: 'Person'
};

export default LoginPage;
