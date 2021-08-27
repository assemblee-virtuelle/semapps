import React from 'react';
import { Typography, Box, makeStyles, Avatar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  parent: props => ({
    position: 'relative',
    ...props.parent
  }),
  square: {
    width: '100%',
    paddingBottom: '100%',
    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    // backgroundColor: theme.palette.primary.main,
    '& svg': {
      width: '55%',
      height: '55%'
    }
  },
  child: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    marginBottom: 10
  },
  caption: {
    color: 'black',
    fontSize: 13
  }
}));

const AvatarField = ({ record, label, defaultLabel, image, fallback, variant, labelColor, classes, children }) => {
  classes = useStyles(classes);
  if (!record) return null;

  const computedLabel = ( typeof label === 'function' ? label(record) : record[label] ) || defaultLabel;
  const computedImage = typeof image === 'function' ? image(record) : record[image];
  const computedFallback = typeof fallback === 'function' ? fallback(record) : fallback;

  return (
    <Box className={classes.parent}>
      <div className={classes.square}>
        <Avatar
          src={computedImage || computedFallback}
          alt={computedLabel}
          fallback={computedFallback}
          className={classes.avatar}
          variant={variant}
        >
          {children}
        </Avatar>
      </div>
      <Box bgcolor={labelColor} className={classes.child} borderRadius={5}>
        <Typography align="center" className={classes.caption} noWrap>
          {computedLabel}
        </Typography>
      </Box>
    </Box>
  );
};

AvatarField.defaultProps = {
  labelColor: 'secondary.main'
};

export default AvatarField;
