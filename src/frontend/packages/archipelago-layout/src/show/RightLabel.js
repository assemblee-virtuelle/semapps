import React from 'react';
import { useTranslate, getFieldLabelTranslationArgs } from 'react-admin';
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

const RightLabel = ({ label, children, record, resource, source, basePath, mb }) => {
  const classes = useStyles();
  const translate = useTranslate();
  if (!record?.[source]) return null;
  return (
    <Box mb={mb}>
      <Box className={classes.rightLabel}>
        {translate(
          ...getFieldLabelTranslationArgs({
            label,
            resource,
            source
          })
        )}
      </Box>
      {children && (
        <Box m={0}>
          {React.cloneElement(children, {
            record,
            resource,
            basePath
          })}
        </Box>
      )}
    </Box>
  );
};

RightLabel.defaultProps = {
  mb: 4
};

export default RightLabel;
