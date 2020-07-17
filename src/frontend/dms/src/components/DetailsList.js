import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  line: {
    borderBottom: '1px solid #e0e0e0',
    marginTop: -6,
    marginBottom: 7
  }
}));

const DetailsList = ({ basePath, children, record, resource }) => {
  const classes = useStyles();
  return (
    <Box>
      {React.Children.map(children, field =>
        field && React.isValidElement(field) ? (
          <div key={field.props.source}>
            {field.props.addLabel ? (
              <Grid container spacing={3} className={classes.line}>
                <Grid item xs={3}>
                  <Typography color="textSecondary" align="right" variant="body2">
                    {field.props.label}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">
                    {React.cloneElement(field, {
                      record,
                      resource,
                      basePath
                    })}
                  </Typography>
                </Grid>
              </Grid>
            ) : typeof field.type === 'string' ? (
              field
            ) : (
              React.cloneElement(field, {
                record,
                resource,
                basePath
              })
            )}
          </div>
        ) : null
      )}
    </Box>
  );
};

export default DetailsList;
