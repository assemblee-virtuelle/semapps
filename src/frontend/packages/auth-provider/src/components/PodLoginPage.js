import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useNotify, useAuthProvider, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { Box, createTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar, makeStyles, Divider } from '@material-ui/core';
import { Card, Typography } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import StorageIcon from '@material-ui/icons/Storage';

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
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

const PodLoginPage = ({ theme, history, location, text, customPodProviders }) => {
  const classes = useStyles();
  const notify = useNotify();
  const authProvider = useAuthProvider();
  const [podProviders, setPodProviders] = useState(customPodProviders || []);
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    (async () => {
      if (podProviders.length === 0) {
        const results = await fetch('https://data.activitypods.org/pod-providers', {
          headers: {
            Accept: 'application/ld+json'
          }
        });
        if (results.ok) {
          const json = await results.json();
          setPodProviders(json['ldp:contains']);
        } else {
          notify('auth.message.pod_providers_not_loaded', 'error');
        }
      }
    })();
  }, [podProviders, setPodProviders, notify]);

  useEffect(() => {
    (async () => {
      if (searchParams.has('login') || searchParams.has('signup')) {
        if (searchParams.has('token')) {
          const token = searchParams.get('token');
          const { webId } = jwtDecode(token);
          const response = await fetch(webId, {
            headers: {
              Accept: 'application/json'
            }
          });
          if (!response.ok) {
            notify('auth.message.unable_to_fetch_user_data', 'error');
          } else {
            const data = await response.json();
            if (!authProvider.checkUser(data)) {
              notify('auth.message.user_not_allowed_to_login', 'error');
              history.replace('/login');
            } else {
              localStorage.setItem('token', token);
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
  }, [searchParams]);

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
          <Box m={2}>
            <List className={classes.list}>
              {podProviders.map((podProvider, i) => {
                const url = new URL('/auth', (podProvider['apods:domainName'].includes(':') ? 'http://' : 'https://') + podProvider['apods:domainName']);
                if (searchParams.has('signup')) url.searchParams.set('signup', 'true');
                url.searchParams.set('redirect', window.location.href);
                return (
                  <>
                    <Divider />
                  <ListItem
                    key={i}
                    button
                    onClick={() => (window.location.href = url.toString())}
                    className={classes.listItem}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <StorageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={podProvider['apods:domainName']} secondary={podProvider['apods:area']} />
                  </ListItem>

                  </>
                );
              })}
            </List>
          </Box>
        </Card>
      </div>
      <Notification />
    </ThemeProvider>
  );
};

export default PodLoginPage;
