import React from 'react';

import { Container, Box, Grid, Hidden, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import SearchForm from './SearchForm';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    height: 65
  },
  logo: {
    position: 'absolute',
    top: -15,
    height: 110,
    width: 110,
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      top: 0,
      width: 65,
      height: 65
    }
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
          <Hidden xsDown>
            <Grid item sm={6}>
              <Box pt={2}>
                <SearchForm />
              </Box>
            </Grid>
          </Hidden>
          <Grid item sm={3} align="right">
            <Box pt={2}>{React.cloneElement(userMenu, { logout })}</Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

AppBar.defaultProps = {
  userMenu: <UserMenu />
};

export default AppBar;
