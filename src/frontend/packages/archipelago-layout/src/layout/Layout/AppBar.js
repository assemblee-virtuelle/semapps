import React from 'react';
import { Container, Box, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SearchForm from './SearchForm';
import ResourceTabs from '../../list/ResourceTabs';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    height: 80
  },
  logo: {
    height: 80,
    width: 80,
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      top: 0,
      width: 65,
      height: 65
    }
  },
  title: {
    position: 'absolute',
    top: 100,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}));

const AppBar = ({ userMenu, logout }) => {
  const classes = useStyles();
  return (
    <Box bgcolor="primary.main">
      <Container maxWidth="lg" className={classes.header}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Link to="/">
              <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="SemApps" className={classes.logo} />
            </Link>
          </Grid>
          <Grid item sm={9} align="right">
            <Box p={1} align="right">
              <ResourceTabs />
            </Box>
          </Grid>
        </Grid>
        <Typography variant="h4" color="primary" className={classes.title} id="react-admin-title" component="h1" />
      </Container>
    </Box>
  );
};

export default AppBar;
