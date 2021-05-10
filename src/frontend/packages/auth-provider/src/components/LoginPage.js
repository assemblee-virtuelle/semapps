import * as React from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
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

const LoginPage = ({ theme, history, location, buttons }) => {
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();

  const searchParams = new URLSearchParams(location.search);
  if (searchParams.has('token')) {
    localStorage.setItem('token', searchParams.get('token'));
    notify('Vous êtes maintenant connecté', 'info');
    history.push('/');
  }

  if (searchParams.has('logout')) {
    localStorage.removeItem('token');
    notify('Vous êtes maintenant déconnecté', 'info');
    history.push('/');
  }

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
            buttons.map(button => (
              <CardActions>
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
  buttons: [<Button startIcon={<Avatar src="/lescommuns.jpg" />}>Les Communs</Button>]
};

export default LoginPage;
