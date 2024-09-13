import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { Notification } from 'react-admin';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.secondary.main
    }
  },
  root: {
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      padding: '1em'
    }
  },
  card: {
    width: '100%',
    maxWidth: 450,
    marginTop: '6em'
  },
  icon: {
    marginTop: 5,
    marginRight: 5
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontWeight: 'bold',
      marginTop: 12
    }
  }
}));

const SimpleBox = ({ title, icon, text, children }) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={classes.root}>
      <Card className={classes.card}>
        <Box p={2} display="flex" justifyContent="start">
          {icon && React.cloneElement(icon, { fontSize: 'large', className: classes.icon })}
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
        </Box>
        <Box pl={2} pr={2}>
          <Typography variant="body1">{text}</Typography>
        </Box>
        {children}
      </Card>
      <Notification />
    </Box>
  );
};

export default SimpleBox;
