import React from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  parent: props => ({
    position: 'relative',
    ...props.parent
  }),
  image: props => ({
    width: '100%',
    borderRadius: '50%',
    ...props.image
  }),
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

/**
 * @deprecated Use AvatarField
 */
const UserIcon = ({ record, styles, ...otherProps }) => {
  console.log();
  const classes = useStyles(styles);
  const fullName = record ? record['pair:firstName'] + ' ' + record['pair:lastName'] : '';
  return (
    <Box className={classes.parent}>
      <img
        src={(record && record['image']) || process.env.PUBLIC_URL + '/unknown-user.png'}
        className={classes.image}
        alt={fullName}
      />
      <Box bgcolor="secondary.main" className={classes.child} borderRadius={7}>
        <Typography align="center" className={classes.caption} noWrap>
          {fullName}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserIcon;
