import React, { useState } from 'react';
import { useLogin } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Avatar, CardActions } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%'
  },
  icon: {
    width: 24,
    height: 24
  }
}));

const LoginForm = () => {
  const classes = useStyles();
  const login = useLogin();
  const [loading, setLoading] = useState(false);

  const url = new URL(window.location);
  if (url.searchParams.has('token')) {
    localStorage.setItem('token', url.searchParams.get('token'));
    url.searchParams.delete('token');
    window.location.href = url.toString();
  }

  return (
    <div>
      <CardActions>
        <Button
          className={classes.button}
          variant="outlined"
          type="submit"
          onClick={login}
          disabled={loading}
          startIcon={<Avatar src="/lescommuns.jpg" className={classes.icon} />}
        >
          {loading && <CircularProgress size={18} thickness={2} />}
          Les Communs
        </Button>
      </CardActions>
    </div>
  );
};

export default LoginForm;
