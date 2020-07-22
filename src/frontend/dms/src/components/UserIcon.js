import React from 'react';
import { Typography, Grid, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  parent: {
    position: 'relative'
  },
  child: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6
  },
  caption: {
    fontSize: 13
  }
}));

const UserIcon = ({ record, xs }) => {
  const classes = useStyles();
  const fullName = record ? record.firstName + ' ' + record.lastName : '';
  return (
    <Grid item xs={xs}>
      <Box  className={classes.parent}>
        <img
          src={process.env.PUBLIC_URL + '/unknown-user.png'}
          style={{ width: '100%' }}
          alt={fullName}
        />
        <Box bgcolor="primary.main" className={classes.child} borderRadius={7}>
          <Typography align="center" className={classes.caption} noWrap>{fullName}</Typography>
        </Box>
      </Box>
    </Grid>
  );
};

UserIcon.defaultProps = {
  xs: 6
};

export default UserIcon;
