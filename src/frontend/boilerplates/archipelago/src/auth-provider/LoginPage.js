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
    height: '1px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)'
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
  },
  button: {
    width: '100%'
  },
  icon: {
    width: 24,
    height: 24
  }
}));

const LoginPage = ({ theme, history, location }) => {
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
          <CardActions>
            <Button
              className={classes.button}
              variant="outlined"
              type="submit"
              onClick={() => login()}
              startIcon={<Avatar src="/lescommuns.jpg" className={classes.icon} />}
            >
              Les Communs
            </Button>
          </CardActions>
        </Card>
      </div>
      <Notification />
    </ThemeProvider>
  );
};

export default LoginPage;
