import React from 'react';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import DetailsList from "./DetailsList";

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
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" />
        </Grid>
        <Grid item xs={7}>
          <DetailsList record={record} resource={resource} basePath={basePath}>
            {children}
          </DetailsList>
        </Grid>
      </Grid>
    </div>
  );
};

export default Hero;
