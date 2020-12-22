import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import DetailsList from './DetailsList';
import MainImage from './MainImage';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

const Hero = ({ basePath, children, record, resource, image, defaultImage }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5}>
          <MainImage record={record} source={image} defaultImage={defaultImage} />
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

Hero.defaultProps = {
  defaultImage: process.env.PUBLIC_URL + '/logo192.png'
};

export default Hero;
