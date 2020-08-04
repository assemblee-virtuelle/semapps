import React from "react";
import { Container, Box, Grid, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SearchForm from './SearchForm';

const useStyles = makeStyles(() => ({
  header: {
    position: 'relative',
    height: 65
  },
  logo: {
    position: 'absolute',
    top: -15,
    height: 110,
    width: 110
  }
}));

const Header = () => {
  const classes = useStyles();
  return(
    <Box bgcolor="primary.main">
      <Container maxWidth="lg" className={classes.header}>
        <Grid container>
          <Grid item xs={3}>
            <Link to="/Organization">
              <img
                src={process.env.PUBLIC_URL + '/av.png'}
                alt="Assemblée Virtuelle"
                className={classes.logo}
              />
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Box p={2}>
            <SearchForm />
            </Box>
          </Grid>
          <Grid item xs={3}/>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header;
