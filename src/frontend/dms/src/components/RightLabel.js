import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  rightLabel: {
    color: 'grey',
    textAlign: 'right',
    borderBottom: '2px dashed grey',
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 10
  }
}));

const RightLabel = ({ label, children, record, resource, basePath }) => {
  const classes = useStyles();
  return (
    <Box mb={3}>
      <Box className={classes.rightLabel}>
        {label}
      </Box>
      <Box m={0}>
        {React.cloneElement(children, {
          record,
          resource,
          basePath
        })}
      </Box>
    </Box>
  );
};

export default RightLabel;
