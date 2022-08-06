import React from 'react';
import { useRecordContext } from 'react-admin';
import { Box, makeStyles, Avatar, Chip } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

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
  chip: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginBottom: 10,
    cursor: 'pointer'
  },
  launchIcon: {
    width: 14
  }
}));

const handleClick = () => {};

const AvatarWithLabelField = ({ label, defaultLabel, image, fallback, externalLink, labelColor, classes, ...rest }) => {
  classes = useStyles(classes);
  const record = useRecordContext();

  const computedLabel = (typeof label === 'function' ? label(record) : record[label]) || defaultLabel;
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
          {...rest}
        />
      </div>
      {externalLink ? (
        <Chip
          color={labelColor}
          className={classes.chip}
          size="small"
          label={computedLabel}
          deleteIcon={<LaunchIcon className={classes.launchIcon} />}
          onDelete={handleClick}
        />
      ) : (
        <Chip color={labelColor} className={classes.chip} size="small" label={computedLabel} />
      )}
    </Box>
  );
};

AvatarWithLabelField.defaultProps = {
  labelColor: 'secondary',
  externalLink: false
};

export default AvatarWithLabelField;
