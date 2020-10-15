import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import DetailsList from './DetailsList';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

const Hero = ({ basePath, children, record, resource, title, image }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box>
        <Typography variant="h3" color="primary" paragraph>
          {React.cloneElement(title, { record })}
        </Typography>
      </Box>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5}>
          <img src={image || process.env.PUBLIC_URL + '/logo192.png'} width="100%" alt={title} />
        </Grid>
        <Grid item xs={12} sm={7}>
          <DetailsList record={record} resource={resource} basePath={basePath}>
            {children}
          </DetailsList>
        </Grid>
      </Grid>
    </div>
  );
};

export default Hero;
