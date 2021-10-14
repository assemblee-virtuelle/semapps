import React from 'react';
import { makeStyles, Box, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  loader: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    paddingTop: 100,
    paddingBottom: 100
  },
  image: {
    width: '100%',
    maxHeight: 'none',
    margin: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      margin: 0
    },
    '@media print': {
      maxWidth: 250,
      height: 'auto'
    }
  }
}));

const MainImage = ({ record, source, defaultImage, ...rest }) => {
  const classes = useStyles();

  if (!record[source]) {
    record[source] = defaultImage;
  }

  const image = Array.isArray(record[source]) ? record[source][0] : record[source];

  if (image.rawFile instanceof File) {
    return (
      <Box align="center" className={classes.loader}>
        <CircularProgress />
      </Box>
    );
  } else {
    return <img src={image} className={classes.image} alt={record['pair:label']} {...rest} />;
  }
};

export default MainImage;
