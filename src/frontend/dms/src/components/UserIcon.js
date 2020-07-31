import React from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';

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
    color: 'black',
    fontSize: 13
  }
}));

const UserIcon = ({ record }) => {
  const classes = useStyles();
  const fullName = record ? record.firstName + ' ' + record.lastName : '';
  return (
    <Box className={classes.parent}>
      <img src={process.env.PUBLIC_URL + '/unknown-user.png'} style={{ width: '100%' }} alt={fullName} />
      <Box bgcolor="primary.main" className={classes.child} borderRadius={7}>
        <Typography align="center" className={classes.caption} noWrap>
          {fullName}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserIcon;
