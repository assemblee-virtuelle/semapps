import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNotify, useAuthProvider, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Card, CardActions, Typography } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

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

const PodLoginPage = ({ theme, history, location, podProviders, userResource, text }) => {
  const classes = useStyles();
  const notify = useNotify();
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
          const response = await fetch(webId, {
            headers: {
              Accept: 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (!authProvider.checkUser(data)) {
              notify('auth.message.user_not_allowed_to_login', 'error');
              history.replace('/login');
            } else {
              localStorage.setItem('token', token);
              if (searchParams.has('new') && searchParams.get('new') === 'true') {
                notify('auth.message.new_user_created', 'info');
                history.push('/' + userResource + '/' + encodeURIComponent(data.url || webId) + '/edit');
              } else {
                notify('auth.message.user_connected', 'info');
                history.push('/');
              }
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
          {podProviders &&
            podProviders.map((podProvider, i) => {
              const url = new URL(podProvider);
              url.searchParams.set('mode', 'login');
              url.searchParams.set('redirect', window.location.href);
              return (
                <CardActions key={i}>
                  <Button
                    fullWidth
                    variant="outlined"
                    type="submit"
                    onClick={() => (window.location.href = url.toString())}
                  >
                    {url.host}
                  </Button>
                </CardActions>
              );
            })}
        </Card>
      </div>
      <Notification />
    </ThemeProvider>
  );
};

// TODO deprecate this
PodLoginPage.defaultProps = {
  userResource: 'Person'
};

export default PodLoginPage;
