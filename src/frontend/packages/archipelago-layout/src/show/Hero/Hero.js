import React from 'react';
import { useShowContext } from 'react-admin';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import DetailsList from './DetailsList';
import MainImage from './MainImage';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(-1)
  }
}));

const Hero = ({ children, image, defaultImage }) => {
  const classes = useStyles();
  const {
    basePath, // deduced from the location, useful for action buttons
    loaded, // boolean that is false until the record is available
    record, // record fetched via dataProvider.getOne() based on the id from the location
    resource // the resource name, deduced from the location. e.g. 'posts'
  } = useShowContext();

  if (!loaded) return null;

  return (
    <div className={classes.root}>
      <Typography variant="h3" color="primary" component="h1" id="react-admin-title" />
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <MainImage record={record} source={image} defaultImage={defaultImage} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <DetailsList record={record} resource={resource} basePath={basePath}>
            {children}
          </DetailsList>
        </Grid>
      </Grid>
    </div>
  );
};

Hero.defaultProps = {
  defaultImage: process.env.PUBLIC_URL + '/logo512.png'
};

export default Hero;
