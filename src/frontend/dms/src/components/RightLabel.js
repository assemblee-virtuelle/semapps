import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  rightLabel: {
    color: 'grey',
    textAlign: 'right',
    borderBottom: '1px dashed #c0c0c0',
    paddingBottom: 10,
    marginBottom: 10
  }
}));

const RightLabel = ({ label, children, record, resource, basePath }) => {
  const classes = useStyles();
  return (
    <Box mb={4}>
      <Box className={classes.rightLabel}>{label}</Box>
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
