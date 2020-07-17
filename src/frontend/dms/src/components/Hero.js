import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

const Hero = ({ basePath, children, record, resource, title }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box>
        <Typography variant="h3" color="primary" paragraph>
          {React.cloneElement(title, { record })}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" />
        </Grid>
        <Grid item xs={8}>
          {React.Children.map(children, field =>
            field && React.isValidElement(field)
              ? React.cloneElement(field, {
                resource,
                record,
                basePath
              })
              : null
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Hero;
