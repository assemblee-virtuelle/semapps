import React from 'react';
import { makeStyles, Box, CircularProgress } from '@material-ui/core';
import { ImageField as RaImageField } from 'react-admin';

const useStyles = makeStyles(theme => ({
  loader: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    paddingTop: 100,
    paddingBottom: 100
  },
  image: {
    width: '100%',
    maxHeight: 'none'
  }
}));

const MainImage = ({record, source, defaultImage, ...otherProps}) => {
  const classes = useStyles();

  if( !record[source] ) {
    record[source] = defaultImage;
  } else if( record[source].rawFile instanceof File ) {
    return(<Box align="center" className={classes.loader}><CircularProgress /></Box> );
  }
  // // For the display, we need to have the URI in a src property
  // if( typeof record === 'string' ) record = { [source]: record };
  //
  return <RaImageField record={record} source={source} classes={{ image: classes.image }} {...otherProps} />
};

export default MainImage;
